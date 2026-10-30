import { Link } from 'react-router-dom';
import SpacioLogo from '../components/SpacioLogo';
import './Landing.css';

/**
 * Screen 01 — Splash / Landing
 * Warm cream background, botanical brand, campus illustration,
 * "Find Your Space on Campus" heading, Log In + Sign Up CTAs.
 */
export default function Landing() {
  return (
    <div className="landing-page">
      {/* Brand header */}
      <header className="landing-header">
        <SpacioLogo to={null} size="md" />
      </header>

      {/* Hero content */}
      <main className="landing-main" id="main-content">
        <div className="landing-text">
          <p className="text-eyebrow" style={{ marginBottom: 8 }}>YOUR CAMPUS, YOUR SPACE</p>
          <h1 className="landing-headline">
            Find Your Space<br />on Campus
          </h1>
          <p className="landing-sub">
            Your campus, your own pace.<br />
            Check space availability before you head out.
          </p>
        </div>

        {/* Campus illustration */}
        <div className="landing-hero-img">
          <img
            src="/campus_hero.jpg"
            alt="A beautiful campus courtyard with gothic architecture and lush gardens"
          />
        </div>

        {/* CTAs */}
        <div className="landing-ctas">
          <Link to="/login" className="btn-primary">
            Log In
          </Link>
          <Link to="/signup" className="btn-secondary">
            Sign Up
          </Link>
        </div>

        <p className="landing-footer-note">
          Make for everyday campus life.
        </p>
      </main>
    </div>
  );
}
