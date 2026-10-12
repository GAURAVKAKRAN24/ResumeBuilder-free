import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sendLoginNotificationEmail, sendSignupWelcomeEmail } from '../utils/notificationService';

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse Google JWT:', e);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('proresume_auth_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Clean legacy dicebear placeholders so custom default avatar renders cleanly
      if (parsed?.picture && typeof parsed.picture === 'string' && parsed.picture.includes('dicebear.com')) {
        parsed.picture = null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  });

  const [googleClientId, setGoogleClientIdState] = useState(() => {
    return import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('proresume_google_client_id') || '801974035698-1ok6smm6osh23v9jk4oe414fpeiiomvb.apps.googleusercontent.com';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [lastNotification, setLastNotification] = useState(null);

  // Sync Supabase Auth session if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleSupabaseUser(session.user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        handleSupabaseUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSupabaseUser = (suUser) => {
    const rawPic = suUser.user_metadata?.avatar_url || suUser.user_metadata?.picture;
    const cleanPic = rawPic && !rawPic.includes('dicebear.com') ? rawPic : null;
    const userData = {
      id: suUser.id,
      name: suUser.user_metadata?.full_name || suUser.user_metadata?.name || suUser.email?.split('@')[0],
      email: suUser.email,
      picture: cleanPic,
      provider: suUser.app_metadata?.provider || 'supabase',
      signedInAt: Date.now(),
    };
    setUser(userData);
    localStorage.setItem('proresume_auth_user', JSON.stringify(userData));

    // Also sync to public.profiles table in Supabase (visible in Table Editor)
    if (isSupabaseConfigured && suUser.id) {
      supabase
        .from('profiles')
        .upsert({
          id: suUser.id,
          email: suUser.email,
          full_name: userData.name,
          avatar_url: userData.picture,
          provider: userData.provider,
          updated_at: new Date().toISOString(),
        })
        .then(() => {})
        .catch((e) => console.warn('Profile sync notice:', e));
    }

    return userData;
  };

  // Save auth user state in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('proresume_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('proresume_auth_user');
    }
  }, [user]);

  const setGoogleClientId = (id) => {
    const trimmed = (id || '').trim();
    setGoogleClientIdState(trimmed);
    if (trimmed) {
      localStorage.setItem('proresume_google_client_id', trimmed);
    } else {
      localStorage.removeItem('proresume_google_client_id');
    }
  };

  // 1. Sign Up with Email and Password (Supabase Cloud)
  const signUpWithEmail = async (email, password, fullName = '') => {
    const cleanEmail = email.trim();
    const cleanName = fullName.trim() || cleanEmail.split('@')[0];

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: cleanName,
          },
        },
      });

      if (error) throw error;

      // Send welcome email notification
      await sendSignupWelcomeEmail({ email: cleanEmail, name: cleanName });
      setLastNotification(`Welcome email sent to ${cleanEmail}`);

      if (data.session?.user) {
        const u = handleSupabaseUser(data.session.user);
        setIsAuthModalOpen(false);
        return { user: u, needsConfirmation: false };
      } else {
        // Confirmation email required by Supabase settings
        return { user: null, needsConfirmation: true, message: 'Please check your email to confirm your account.' };
      }
    } else {
      // Local fallback if Supabase not configured yet
      const userData = {
        id: `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        name: cleanName,
        email: cleanEmail,
        picture: null,
        provider: 'email',
        signedInAt: Date.now(),
      };
      setUser(userData);
      setIsAuthModalOpen(false);
      await sendSignupWelcomeEmail({ email: cleanEmail, name: cleanName });
      setLastNotification(`Welcome email sent to ${cleanEmail}`);
      return { user: userData, needsConfirmation: false };
    }
  };

  // 2. Sign In with Email and Password (Supabase Cloud)
  const signInWithEmail = async (email, password) => {
    const cleanEmail = email.trim();

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) throw error;

      if (data.user) {
        const u = handleSupabaseUser(data.user);
        setIsAuthModalOpen(false);

        // Send login notification email
        await sendLoginNotificationEmail({ email: cleanEmail, name: u.name, provider: 'Email & Password' });
        setLastNotification(`Login alert sent to ${cleanEmail}`);
        return u;
      }
    } else {
      // Local fallback if Supabase not configured yet
      const userData = {
        id: `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        picture: null,
        provider: 'email',
        signedInAt: Date.now(),
      };
      setUser(userData);
      setIsAuthModalOpen(false);
      await sendLoginNotificationEmail({ email: cleanEmail, name: userData.name, provider: 'Email & Password' });
      setLastNotification(`Login alert sent to ${cleanEmail}`);
      return userData;
    }
  };

  // 3. Sign In with Google OAuth (Supabase Cloud)
  const signInWithGoogleOAuth = async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/resume`,
        },
      });
      if (error) throw error;
    } else {
      // Fallback
      loginWithEmailGoogle('gauravkakran24@gmail.com', 'Gaurav Kakran');
    }
  };

  // 4. Sign In with Google One-Tap / Credential Token
  const loginWithGoogleToken = async (credential) => {
    const payload = parseJwt(credential);
    if (!payload || !payload.email) {
      throw new Error('Invalid Google credential token');
    }

    const userData = {
      id: payload.sub || `google-${Date.now()}`,
      name: payload.name || payload.given_name || payload.email.split('@')[0],
      email: payload.email,
      picture: payload.picture || null,
      provider: 'google',
      signedInAt: Date.now(),
    };

    setUser(userData);
    setIsAuthModalOpen(false);

    // Send login notification email
    await sendLoginNotificationEmail({ email: userData.email, name: userData.name, provider: 'Google' });
    setLastNotification(`Login alert sent to ${userData.email}`);
    return userData;
  };

  // 5. Sign In with Google OAuth UserInfo Profile (Direct Google GSI / OAuth2 Popup)
  const loginWithGoogleProfile = async (profile) => {
    const userData = {
      id: profile.sub || `google-${Date.now()}`,
      name: profile.name || profile.given_name || profile.email?.split('@')[0],
      email: profile.email,
      picture: profile.picture || null,
      provider: 'google',
      signedInAt: Date.now(),
    };

    setUser(userData);
    localStorage.setItem('proresume_auth_user', JSON.stringify(userData));

    // Also sync to Supabase profiles table if available
    if (isSupabaseConfigured && userData.id) {
      supabase
        .from('profiles')
        .upsert({
          id: userData.id,
          email: userData.email,
          full_name: userData.name,
          avatar_url: userData.picture,
          provider: 'google',
          updated_at: new Date().toISOString(),
        })
        .then(() => {})
        .catch(() => {});
    }

    setIsAuthModalOpen(false);

    // Send login notification email
    await sendLoginNotificationEmail({ email: userData.email, name: userData.name, provider: 'Google' });
    setLastNotification(`Login alert sent to ${userData.email}`);
    return userData;
  };

  const loginWithEmailGoogle = async (email = 'gauravkakran24@gmail.com', name = 'Gaurav Kakran') => {
    const cleanEmail = (email || '').trim() || 'gauravkakran24@gmail.com';
    const cleanName = (name || '').trim() || cleanEmail.split('@')[0];
    const userData = {
      id: `google-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name: cleanName,
      email: cleanEmail,
      picture: null,
      provider: 'google',
      signedInAt: Date.now(),
    };
    setUser(userData);
    setIsAuthModalOpen(false);

    // Send login notification email
    await sendLoginNotificationEmail({ email: cleanEmail, name: cleanName, provider: 'Demo Google' });
    setLastNotification(`Login alert sent to ${cleanEmail}`);
    return userData;
  };

  const loginDemo = () => {
    return loginWithEmailGoogle('gauravkakran24@gmail.com', 'Gaurav Kakran');
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error(e);
      }
    }
    setUser(null);
    localStorage.removeItem('proresume_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        googleClientId,
        setGoogleClientId,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogleOAuth,
        loginWithGoogleToken,
        loginWithGoogleProfile,
        loginWithEmailGoogle,
        loginDemo,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        lastNotification,
        isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
