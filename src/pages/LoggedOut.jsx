import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import SpacioLogo from '../components/SpacioLogo';
import './LoggedOut.css';

/**
 * Screen 14 — Logged Out
 * Calm confirmation screen: SPACIO logo, campus image, success icon,
 * "You've Been Logged Out" heading, description, Log In button.
 */
export default function LoggedOut() {
  return (
    <div className="loggedout-page">
      <div className="loggedout-brand">
        <SpacioLogo to={null} size="md" />
      </div>

      {/* Campus image */}
      <div className="loggedout-img-wrap">
        <img src="/campus_hero.jpg" alt="Campus courtyard" />
      </div>

      {/* Success content */}
      <div className="loggedout-content">
        <div className="loggedout-success-icon" aria-hidden="true">
          <CheckCircle size={28} />
        </div>

        <h1 className="loggedout-title">You've Been Logged Out</h1>
        <p className="loggedout-desc">
          Thanks for using SPACIO. See you next time!
        </p>
        <p className="loggedout-note">
          Your saved spaces will be waiting when you log back in.
        </p>

        <Link to="/login" className="btn-primary" style={{ marginTop: 8 }}>
          Log In
        </Link>
      </div>
    </div>
  );
}
