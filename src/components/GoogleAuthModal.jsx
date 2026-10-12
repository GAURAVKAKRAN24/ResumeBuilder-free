import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CVnestLogo } from './CVnestLogo';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Send,
  Eye,
  EyeOff
} from 'lucide-react';

export function GoogleAuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    googleClientId,
    signUpWithEmail, 
    signInWithEmail, 
    signInWithGoogleOAuth,
    loginWithGoogleProfile,
    loginWithEmailGoogle,
    isSupabaseConfigured
  } = useAuth();

  // Mode: 'signin' | 'signup'
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & loading
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handlePostLogin = () => {
    if (location.pathname === '/') {
      navigate('/resume', { replace: true });
    }
  };

  // Handle Google Login Click (One single clean Google Action)
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      // 1. If Google Identity Services OAuth2 is loaded and googleClientId is present:
      if (window.google?.accounts?.oauth2 && googleClientId) {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              setLoading(false);
              setErrorMsg('Google sign-in was cancelled.');
              return;
            }
            if (tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const profile = await res.json();
                const u = await loginWithGoogleProfile(profile);
                setSuccessMsg(`Signed in as ${u.name}! An alert has been sent to ${u.email}`);
                handlePostLogin();
                setTimeout(() => onClose(), 800);
              } catch (err) {
                setErrorMsg('Error retrieving Google profile: ' + err.message);
              } finally {
                setLoading(false);
              }
            }
          },
        });
        client.requestAccessToken();
        return;
      }

      // 2. Fallback to Supabase OAuth if enabled
      if (isSupabaseConfigured) {
        await signInWithGoogleOAuth();
        return;
      }

      // 3. Fallback demo sign-in
      const u = await loginWithEmailGoogle('user@cvnest.com', 'CVnest User');
      setSuccessMsg(`Signed in as ${u.name}! An alert has been sent to ${u.email}`);
      handlePostLogin();
      setTimeout(() => onClose(), 800);
    } catch (err) {
      if (err.message?.includes('provider is not enabled')) {
        setErrorMsg('Google provider is not enabled in your Supabase Dashboard yet. You can sign in using Email & Password below.');
      } else {
        setErrorMsg(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Form Submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const res = await signUpWithEmail(email, password, fullName);
        if (res.needsConfirmation) {
          setSuccessMsg('Account created! Please check your email to confirm your account.');
        } else {
          setSuccessMsg(`Welcome to CVnest! A welcome email was sent to ${email}`);
          handlePostLogin();
          setTimeout(() => onClose(), 900);
        }
      } else {
        await signInWithEmail(email, password);
        setSuccessMsg(`Welcome back! Login confirmation sent to ${email}`);
        handlePostLogin();
        setTimeout(() => onClose(), 800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-100 z-10 transform animate-in zoom-in-95 duration-200 font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <CVnestLogo size="lg" theme="light" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isSignUp ? 'Create your Account' : 'Welcome to CVnest'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isSignUp 
              ? 'Build and cloud-sync ATS resumes across all your devices.' 
              : 'Sign in to access your saved resumes and unlock high-res ATS PDF.'}
          </p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. SINGLE CLEAN GOOGLE BUTTON */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 active:scale-[0.99] border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-sm shadow-xs hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            or continue with email
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* 2. EMAIL FORM */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Gaurav Kakran"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0d2a3a] via-[#103d4c] to-[#0f606e] hover:opacity-95 active:scale-[0.99] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{isSignUp ? 'Create Free Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Email Notification Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center mt-3">
          <Send className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>A confirmation email will be sent to your inbox</span>
        </div>

        {/* Switch Between Sign In & Sign Up */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setErrorMsg(''); setSuccessMsg(''); }}
                className="font-bold text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setErrorMsg(''); setSuccessMsg(''); }}
                className="font-bold text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
              >
                Sign Up for free
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
