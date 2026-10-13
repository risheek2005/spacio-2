import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import './Auth.css';

/**
 * Mock sign-in. There is no backend: any well-formed email + a password of
 * at least 4 characters is accepted, matching the brief's "accept any
 * valid-looking email/password" instruction. This keeps the flow demoable
 * without pretending to be a real auth service.
 */
export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showForgotNote, setShowForgotNote] = useState(false);

  const validate = () => {
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email or college ID email.';
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
      <header className="auth-header">
        <div className="container">
          <Link to="/" className="auth-brand">
            <span className="brand-mark" aria-hidden="true">S</span>
            <span>Spacio</span>
          </Link>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <Link to="/" className="auth-back-link">
            <ArrowLeft size={15} aria-hidden="true" /> Back
          </Link>
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-subtitle">Check space availability across campus in seconds.</p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="email">Email / College ID</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                autoComplete="email"
              />
              {errors.email && (
                <span id="email-error" className="form-error" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-field">
              <div className="form-row-between">
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="forgot-link"
                  onClick={() => setShowForgotNote((v) => !v)}
                  aria-expanded={showForgotNote}
                  aria-controls="forgot-note"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                autoComplete="current-password"
              />
              {errors.password && (
                <span id="password-error" className="form-error" role="alert">
                  {errors.password}
                </span>
              )}
            </div>

            {showForgotNote && (
              <p id="forgot-note" className="forgot-note">
                This is a demo build, so password reset isn't wired up — just sign in with any
                email and a password of 4+ characters.
              </p>
            )}

            <p className="auth-hint">Demo tip: any college email and a 4+ character password will work.</p>

            <Button as="button" type="submit" variant="primary" size="lg" fullWidth>
              Sign In
            </Button>
          </form>

          <p className="auth-footer-line">
            New to Spacio? <Link to="/signup">Create account</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
