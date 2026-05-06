import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { X } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { authSignup, authLogin, authGoogle } from '../services/api';
import logoLight from '../assets/logo-Photoroom.png';
import logoDark from '../assets/logo-dark.png';
import './LoginPopup.css';

const LoginPopup = () => {
  const { showLoginPopup, closeLoginPopup, loginWithUserData } = useUser();
  const { theme } = useTheme();
  const currentLogo = theme === 'dark' ? logoDark : logoLight;

  // 'login' | 'signup'
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showLoginPopup) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  // ── Google login handler ──
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const data = await authGoogle(credentialResponse.credential);
      loginWithUserData(data.user);
      resetForm();
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login was cancelled or failed');
  };

  // ── Manual login handler ──
  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setError('');
    try {
      const data = await authLogin({ email: email.trim(), password });
      loginWithUserData(data.user);
      resetForm();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Manual signup handler ──
  const handleManualSignup = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) return;
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await authSignup({ name: name.trim(), email: email.trim(), password });
      loginWithUserData(data.user);
      resetForm();
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      closeLoginPopup();
    }
  };

  const isLoginValid = email.trim() && password;
  const isSignupValid = name.trim() && email.trim() && password;

  return (
    <div className="login-overlay" onClick={handleOverlayClick}>
      <div className="login-popup">
        {/* Close button */}
        <button
          className="login-close-btn"
          onClick={closeLoginPopup}
          title="Close"
          disabled={loading}
        >
          <X size={18} />
        </button>

        {/* Header with logo */}
        <div className="login-header">
          <div className="login-logo">
            <img src={currentLogo} alt="OpsMind AI" />
          </div>
          <h2 className="login-title">
            {mode === 'login' ? 'Welcome to OpsMind AI' : 'Create your account'}
          </h2>
          <p className="login-subtitle">
            {mode === 'login'
              ? 'Sign in to access your company knowledge workspace'
              : 'Join your team on OpsMind AI'}
          </p>
        </div>

        {/* Google Login — primary */}
        <div className="login-google-section">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            width="352"
            text={mode === 'login' ? 'signin_with' : 'signup_with'}
            shape="rectangular"
            size="large"
            theme={theme === 'dark' ? 'filled_black' : 'outline'}
          />
        </div>

        {/* Divider */}
        <div className="login-divider">
          <span>or continue with email</span>
        </div>

        {/* Manual form */}
        <form
          className="login-form"
          onSubmit={mode === 'login' ? handleManualLogin : handleManualSignup}
        >
          {mode === 'signup' && (
            <div className="login-field">
              <label className="login-label" htmlFor="login-name">Full name</label>
              <input
                id="login-name"
                type="text"
                className="login-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          )}

          <div className="login-field">
            <label className="login-label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              className="login-input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoFocus
              required
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="login-input"
              placeholder={mode === 'signup' ? 'Minimum 6 characters' : 'Enter your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading || (mode === 'login' ? !isLoginValid : !isSignupValid)}
          >
            {loading && <span className="login-spinner" />}
            {loading
              ? 'Please wait…'
              : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>

        {/* Toggle between login / signup */}
        <div className="login-toggle">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button type="button" className="login-toggle-btn" onClick={() => switchMode('signup')}>
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button type="button" className="login-toggle-btn" onClick={() => switchMode('login')}>
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
