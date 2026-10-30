import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import SpacioLogo from '../components/SpacioLogo';
import { useApp } from '../context/AppContext';
import './Auth.css';

/**
 * Screen 02 — Sign Up
 * Elegant account-registration page matching wireframe.
 * Full Name, Student Email, Password, Confirm Password.
 * Mock auth: valid inputs accepted immediately.
 */
export default function Signup() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid student email.';
    }
    if (form.password.trim().length < 4) next.password = 'Password must be at least 4 characters.';
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    login({ email: form.email.trim(), name: form.name.trim() });
    navigate('/dashboard', { replace: true });
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

        <h1 className="auth-heading">Create Your Account</h1>
        <p className="auth-subheading">
          Login to find your favourite spaces.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              type="text"
              className={`form-input${errors.name ? ' error' : ''}`}
              value={form.name}
              onChange={update('name')}
              placeholder="Enter your full name"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-err' : undefined}
            />
            {errors.name && (
              <span id="name-err" className="form-error" role="alert">{errors.name}</span>
            )}
          </div>

          {/* Student Email */}
          <div className="form-group">
            <label htmlFor="signup-email" className="form-label">Student Email</label>
            <input
              id="signup-email"
              type="email"
              className={`form-input${errors.email ? ' error' : ''}`}
              value={form.email}
              onChange={update('email')}
              placeholder="you@university.edu"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-err' : undefined}
            />
            {errors.email && (
              <span id="email-err" className="form-error" role="alert">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="signup-password" className="form-label">Password</label>
            <div className="password-field">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input${errors.password ? ' error' : ''}`}
                value={form.password}
                onChange={update('password')}
                placeholder="Create a password"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'pw-err' : undefined}
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
              <span id="pw-err" className="form-error" role="alert">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
            <div className="password-field">
              <input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                className={`form-input${errors.confirm ? ' error' : ''}`}
                value={form.confirm}
                onChange={update('confirm')}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirm)}
                aria-describedby={errors.confirm ? 'conf-err' : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirm && (
              <span id="conf-err" className="form-error" role="alert">{errors.confirm}</span>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>
            Sign Up
          </button>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <button
            type="button"
            className="btn-secondary google-btn"
            onClick={() => {
              login({ email: 'student@university.edu', name: 'Student' });
              navigate('/dashboard', { replace: true });
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign Up with Google
          </button>
        </form>

        <p className="auth-footer-link">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Log In</Link>
        </p>
      </main>
    </div>
  );
}
