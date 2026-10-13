import { useNavigate } from 'react-router-dom';
import { Heart, LogOut, Moon, Bell, UserRound, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Toggle from '../components/Toggle';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { FACILITIES } from '../data/facilities';
import './Profile.css';

/**
 * Profile — deliberately minimal (Tesler's Law: nothing here for the user
 * to configure that Spacio doesn't need). Identity, saved spaces, two
 * settings, and sign out. Nothing else.
 */
export default function Profile() {
  const { user, logout, isSaved, toggleSaved, darkMode, toggleDarkMode, notifications, toggleNotifications } =
    useApp();
  const navigate = useNavigate();

  // Clearing the session is enough — ProtectedRoute reacts to the auth
  // state change and redirects to /login on its own. Also calling
  // navigate() here would race that redirect against this one.
  const handleLogout = () => logout();

  return (
    <div className="page">
      <Navbar />

      <main className="profile-main">
        <div className="container profile-container">
          <h1 className="profile-title">Profile</h1>

          <section className="profile-card profile-identity" aria-label="Account">
            <div className="profile-avatar" aria-hidden="true">
              <UserRound size={26} />
            </div>
            <div>
              <p className="profile-name">{user?.name || 'Student'}</p>
              <p className="profile-email">{user?.email || 'you@college.edu'}</p>
            </div>
          </section>

          <section className="profile-card" aria-labelledby="saved-heading">
            <h2 id="saved-heading" className="profile-section-title">
              Saved Spaces
            </h2>
            <ul className="saved-list">
              {FACILITIES.map((facility) => {
                const saved = isSaved(facility.id);
                return (
                  <li key={facility.id} className="saved-row">
                    <button
                      type="button"
                      className="saved-row-main"
                      onClick={() => navigate(`/facility/${facility.id}`)}
                    >
                      <span className="saved-row-text">
                        <span className="saved-row-name">{facility.name}</span>
                        <span className="saved-row-location">
                          <MapPin size={12} aria-hidden="true" />
                          {facility.location}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      className={'save-btn' + (saved ? ' save-btn-active' : '')}
                      onClick={() => toggleSaved(facility.id)}
                      aria-pressed={saved}
                      aria-label={saved ? `Remove ${facility.name} from saved spaces` : `Save ${facility.name}`}
                    >
                      <Heart size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="profile-card" aria-labelledby="settings-heading">
            <h2 id="settings-heading" className="profile-section-title">
              Settings
            </h2>
            <div className="settings-row">
              <span className="settings-label">
                <Moon size={18} aria-hidden="true" />
                <label id="dark-mode-label" htmlFor="dark-mode-toggle">
                  Dark Mode
                </label>
              </span>
              <Toggle id="dark-mode-toggle" checked={darkMode} onChange={toggleDarkMode} label="Dark Mode" />
            </div>
            <div className="settings-row">
              <span className="settings-label">
                <Bell size={18} aria-hidden="true" />
                <label id="notif-label" htmlFor="notifications-toggle">
                  Notifications
                </label>
              </span>
              <Toggle
                id="notifications-toggle"
                checked={notifications}
                onChange={toggleNotifications}
                label="Notifications"
              />
            </div>
          </section>

          <Button as="button" variant="danger" size="lg" icon={LogOut} onClick={handleLogout} fullWidth>
            Log Out
          </Button>
        </div>
      </main>
    </div>
  );
}
