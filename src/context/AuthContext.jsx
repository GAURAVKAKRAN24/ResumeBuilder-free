import React, { createContext, useContext, useState, useEffect } from 'react';

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
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [googleClientId, setGoogleClientIdState] = useState(() => {
    return import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('proresume_google_client_id') || '801974035698-1ok6smm6osh23v9jk4oe414fpeiiomvb.apps.googleusercontent.com';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  const loginWithGoogleToken = (credential) => {
    const payload = parseJwt(credential);
    if (!payload || !payload.email) {
      throw new Error('Invalid Google credential token');
    }

    const userData = {
      id: payload.sub || `google-${Date.now()}`,
      name: payload.name || payload.given_name || payload.email.split('@')[0],
      email: payload.email,
      picture: payload.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(payload.name || 'User')}`,
      provider: 'google',
      signedInAt: Date.now(),
    };

    setUser(userData);
    setIsAuthModalOpen(false);
    return userData;
  };

  const loginWithEmailGoogle = (email = 'gauravkakran24@gmail.com', name = 'Gaurav Kakran') => {
    const cleanEmail = (email || '').trim() || 'gauravkakran24@gmail.com';
    const cleanName = (name || '').trim() || cleanEmail.split('@')[0];
    const userData = {
      id: `google-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name: cleanName,
      email: cleanEmail,
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
      provider: 'google',
      signedInAt: Date.now(),
    };
    setUser(userData);
    setIsAuthModalOpen(false);
    return userData;
  };

  const loginDemo = () => {
    return loginWithEmailGoogle('gauravkakran24@gmail.com', 'Gaurav Kakran');
  };

  const logout = () => {
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
        loginWithGoogleToken,
        loginWithEmailGoogle,
        loginDemo,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
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

