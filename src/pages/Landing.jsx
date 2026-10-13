import { Link } from 'react-router-dom';
import { MapPin, Wifi, Dumbbell, BookOpen } from 'lucide-react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import './Landing.css';

/**
 * Landing Page — the only public "marketing" surface in Spacio, and even
 * here the goal is clarity over persuasion. One headline, one sentence of
 * support, two CTAs, and a truthful preview of the two facilities the app
 * actually covers. No hero video, no feature grid, no logos wall.
 */
export default function Landing() {
  return (
    <div className="page landing">
      <header className="landing-header">
        <div className="container landing-header-inner">
          <div className="landing-brand">
            <span className="brand-mark" aria-hidden="true">S</span>
            <span className="brand-word">Spacio</span>
          </div>
          <nav aria-label="Landing">
            <Link to="/login" className="landing-signin-link">
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="section landing-hero">
          <div className="container landing-hero-inner">
            <p className="eyebrow">Smart Campus Space Discovery</p>
            <h1 className="landing-headline">Know before you go.</h1>
            <p className="landing-subtext">
              Check campus spaces, availability and crowd levels in one place.
            </p>
            <div className="landing-cta-row">
              <Button to="/signup" variant="primary" size="lg">
                Explore Spacio
              </Button>
              <Button to="/login" variant="secondary" size="lg">
                Sign in
              </Button>
            </div>
          </div>
        </section>

        <section className="section landing-preview" aria-labelledby="preview-heading">
          <div className="container">
            <h2 id="preview-heading" className="landing-section-title">
              Two spaces, always at a glance
            </h2>
            <p className="landing-section-sub">
              Spacio currently covers the two facilities students check most.
            </p>

            <div className="landing-preview-grid">
              <div className="preview-card">
                <div className="preview-card-icon">
                  <BookOpen size={20} aria-hidden="true" />
                </div>
                <div className="preview-card-body">
                  <h3>Central Library</h3>
                  <p className="preview-card-location">
                    <MapPin size={13} aria-hidden="true" /> Block A
                  </p>
                  <StatusBadge status="Open" />
                  <p className="preview-card-note">Moderate crowd right now</p>
                </div>
              </div>

              <div className="preview-card">
                <div className="preview-card-icon">
                  <Dumbbell size={20} aria-hidden="true" />
                </div>
                <div className="preview-card-body">
                  <h3>Gym</h3>
                  <p className="preview-card-location">
                    <MapPin size={13} aria-hidden="true" /> Block B
                  </p>
                  <StatusBadge status="Open" />
                  <p className="preview-card-note">Low crowd right now</p>
                </div>
              </div>
            </div>

            <div className="landing-status-key" aria-hidden="true">
              <span className="status-key-item">
                <StatusBadge status="Open" /> Open
              </span>
              <span className="status-key-item">
                <StatusBadge status="Moderate" /> Moderate
              </span>
              <span className="status-key-item">
                <StatusBadge status="Closed" /> Closed / Crowded
              </span>
            </div>
            <p className="demo-note">
              <Wifi size={13} aria-hidden="true" /> Availability shown is illustrative demo data.
            </p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="container landing-footer-inner">
          <span>© 2026 Spacio — a campus UI/UX project</span>
        </div>
      </footer>
    </div>
  );
}
