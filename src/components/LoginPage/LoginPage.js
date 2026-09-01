import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../BrandLogo';

// Sign-up tab is only shown when REACT_APP_ALLOW_SIGNUP=true in .env
const ALLOW_SIGNUP = process.env.REACT_APP_ALLOW_SIGNUP === 'true';

/**
 * Returns identifiable error messages based on the error code
 * @param {*} code - error code
 * @returns error message string
 */
function getFriendlyError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.';
    case 'auth/configuration-not-found':
      return 'Firebase Authentication is not set up for this project. Go to Firebase Console → Authentication → click "Get Started", then enable Email/Password under Sign-in method.';
    case 'permission-denied':
      return 'Account created but profile save was blocked by Firestore security rules. Update your rules to allow authenticated writes, then try again.';
    case 'app/not-configured':
      return 'Firebase is not configured in this local project. Add the required REACT_APP_* values in a .env file before using sign-in or sign-up.';
    case 'unavailable':
      return 'Firestore is temporarily unavailable. Please try again in a moment.';

    // For anything we might miss
    default:
      return `Unexpected error (${code ?? 'unknown'}). Check the browser console for details.`;
  }
}


export default function LoginPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const switchTab = (t) => {
    setTab(t);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
  };

  /**
   * Login form submission handler
   * @param {*} e - form submit event
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('[Login error]', err);
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signup form submission handler
   * @param {*} e - signup event
   * @returns 
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!displayName.trim()) {
      return setError('Please enter your full name.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      await signup(email, password, displayName.trim());
      navigate('/');
    } catch (err) {
      console.error('[Signup error]', err);
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Page
  return (
    <div className="login-page">
      {/* Animated gradient background */}
      <div className="login-bg" aria-hidden="true">
        <div className="login-bg-orb login-bg-orb--orange" />
        <div className="login-bg-orb login-bg-orb--blue" />
        <div className="login-bg-orb login-bg-orb--gold" />
      </div>

      <div className="login-card" role="main">
        {/* Brand header */}
        <div className="login-header">
          <BrandLogo size={44} />
          <div>
            <div className="login-brand-name">Thunder Innovations</div>
            <div className="login-brand-sub">Asset Activation Dashboard</div>
          </div>
        </div>

        {/* Tab switcher — only visible when signup is enabled */}
        {ALLOW_SIGNUP && (
          <div className="login-tabs" role="tablist" aria-label="Authentication mode">
            <button
              id="tab-login"
              role="tab"
              aria-selected={tab === 'login'}
              className={`login-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Sign In
            </button>
            <button
              id="tab-signup"
              role="tab"
              aria-selected={tab === 'signup'}
              className={`login-tab ${tab === 'signup' ? 'active' : ''}`}
              onClick={() => switchTab('signup')}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="login-error" role="alert">
            <span className="login-error-icon">⚠</span>
            {error}
          </div>
        )}

        {/* ── Login form ── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="login-form" noValidate>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@thunder.nba.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading
                ? <span className="login-spinner" aria-label="Signing in…" />
                : 'Sign In'}
            </button>
          </form>
        )}

        {/* ── Sign Up form ── */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup} className="login-form" noValidate>
            <div className="form-group">
              <label htmlFor="signup-name" className="form-label">Full Name</label>
              <input
                id="signup-name"
                type="text"
                className="form-input"
                placeholder="Jane Smith"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                required
                autoComplete="name"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-email" className="form-label">Email Address</label>
              <input
                id="signup-email"
                type="email"
                className="form-input"
                placeholder="you@thunder.nba.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password" className="form-label">Password</label>
              <input
                id="signup-password"
                type="password"
                className="form-input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-confirm" className="form-label">Confirm Password</label>
              <input
                id="signup-confirm"
                type="password"
                className="form-input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              id="signup-submit"
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading
                ? <span className="login-spinner" aria-label="Creating account…" />
                : 'Create Account'}
            </button>

            <p className="login-note">
              New accounts receive full Thunder staff access by default.
              A Thunder admin can update your role and partner scope later.
            </p>
          </form>
        )}

        {/* Footer */}
        <div className="login-footer">
          <span className="login-footer-season">OKC Thunder · Paycom Center · 2025–26 Season</span>
          <div className="login-powered">
            <span>Powered by</span>
            <span className="login-powered-google">Google Firebase</span>
          </div>
        </div>
      </div>
    </div>
  );
}
