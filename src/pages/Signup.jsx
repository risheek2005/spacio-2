import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import './Auth.css';

/**
 * Mock sign-up. Same "no real backend" approach as Login: valid-looking
 * inputs are accepted and the user is signed in immediately afterward.
 */
export default function Signup() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid college email.';
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
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Set up your Spacio account to start checking campus spaces.</p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={update('name')}
                placeholder="Jordan Rivera"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
                autoComplete="name"
              />
              {errors.name && (
                <span id="name-error" className="form-error" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="signup-email">College Email</label>
              <input
                id="signup-email"
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@college.edu"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'signup-email-error' : undefined}
                autoComplete="email"
              />
              {errors.email && (
                <span id="signup-email-error" className="form-error" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                value={form.password}
                onChange={update('password')}
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'signup-password-error' : undefined}
                autoComplete="new-password"
              />
              {errors.password && (
                <span id="signup-password-error" className="form-error" role="alert">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={form.confirm}
                onChange={update('confirm')}
                placeholder="••••••••"
                aria-invalid={Boolean(errors.confirm)}
                aria-describedby={errors.confirm ? 'confirm-password-error' : undefined}
                autoComplete="new-password"
              />
              {errors.confirm && (
                <span id="confirm-password-error" className="form-error" role="alert">
                  {errors.confirm}
                </span>
              )}
            </div>

            <Button as="button" type="submit" variant="primary" size="lg" fullWidth>
              Create Account
            </Button>
          </form>

          <p className="auth-footer-line">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
