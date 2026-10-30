import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import SpacioLogo from '../components/SpacioLogo';
import { useApp } from '../context/AppContext';
import './Auth.css';

/**
 * Screen 03 — Login
 * "Welcome Back" serif heading, email + password with toggle,
 * remember me, forgot password link, Log In button, Google option.
 * Preserves existing mock auth flow.
 */
export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid student email.';
    }
    if (password.trim().length < 4) {
      next.password = 'Password must be at least 4 characters.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    login({ email: email.trim() });
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-top-brand">
        <SpacioLogo to={null} size="md" />
      </div>

      <main className="auth-main" id="main-content">
        <Link to="/" className="auth-back-btn" aria-label="Go back">
          <ArrowLeft size={16} />
        </Link>

        <h1 className="auth-heading">Welcome Back</h1>
        <p className="auth-subheading">
          Login to find your favourite spaces again.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Student Email</label>
            <input
              id="login-email"
              type="email"
              className={`form-input${errors.email ? ' error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'login-email-err' : undefined}
            />
            {errors.email && (
              <span id="login-email-err" className="form-error" role="alert">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="login-password" className="form-label">Password</label>
              <button
                type="button"
                className="auth-forgot-link"
                onClick={() => setShowForgot((v) => !v)}
                aria-expanded={showForgot}
              >
                Forgot Password?
              </button>
            </div>
            <div className="password-field">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input${errors.password ? ' error' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'login-pw-err' : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span id="login-pw-err" className="form-error" role="alert">{errors.password}</span>
            )}
          </div>

          {showForgot && (
            <p className="auth-forgot-note" role="status">
              This is a demo — any university email and a 4+ character password will work.
            </p>
          )}

          {/* Remember me */}
          <label className="auth-remember-row">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="auth-checkbox"
              aria-label="Remember me"
            />
            <span className="auth-remember-label">Remember me</span>
          </label>

          <button type="submit" className="btn-primary" style={{ marginTop: 4 }}>
            Log In
          </button>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <button
            type="button"
            className="btn-secondary google-btn"
            onClick={() => {
              login({ email: 'student@university.edu', name: 'Student' });
              navigate(redirectTo, { replace: true });
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <p className="auth-footer-link">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Sign Up</Link>
        </p>
      </main>
    </div>
  );
}
