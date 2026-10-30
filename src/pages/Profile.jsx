import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserRound, KeyRound, Bell, Globe, Shield, HelpCircle,
  Trash2, LogOut, ChevronRight
} from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import LogoutModal from '../components/LogoutModal';
import { useApp } from '../context/AppContext';
import './Profile.css';

/**
 * Screen 11 — Account Settings
 * Profile card, settings rows for all menu items, logout row.
 * Logout triggers Screen 13 (confirmation modal).
 */
const SETTINGS_ROWS = [
  { id: 'edit-profile',  Icon: UserRound, label: 'Edit Profile',             to: null },
  { id: 'change-pw',    Icon: KeyRound,  label: 'Change Password',           to: null },
  { id: 'notifications', Icon: Bell,     label: 'Notification Preferences',  to: null },
  { id: 'language',     Icon: Globe,     label: 'Language',                  to: null, meta: 'English' },
  { id: 'privacy',      Icon: Shield,    label: 'Privacy & Security',        to: null },
  { id: 'help',         Icon: HelpCircle,label: 'Help & Support',            to: '/help' },
  { id: 'delete',       Icon: Trash2,    label: 'Delete Account',            to: null, danger: true },
];

export default function Profile() {
  const { user } = useApp();
  const [showLogout, setShowLogout] = useState(false);

  const firstName = user?.name?.split(' ')[0] || 'Student';
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'S';

  return (
    <div className="page page-with-nav">
      <div className="profile-page">
        <h1 className="profile-title">Account Settings</h1>

        {/* Profile card */}
        <div className="profile-card">
          <div className="profile-avatar" aria-hidden="true">
            <span className="profile-avatar-initials">{initials}</span>
          </div>
          <div className="profile-info">
            <p className="profile-name">{user?.name || 'Student'}</p>
            <p className="profile-email">{user?.email || 'student@university.edu'}</p>
          </div>
          <button type="button" className="profile-edit-icon" aria-label="Edit profile">
            <UserRound size={16} />
          </button>
        </div>

        {/* Settings list */}
        <div className="settings-list" role="list">
          {SETTINGS_ROWS.map(({ id, Icon, label, to, meta, danger }) => {
            const inner = (
              <div key={id} className={`settings-row${danger ? ' settings-row-danger' : ''}`} role="listitem">
                <span className={`settings-row-icon${danger ? ' danger-icon' : ''}`} aria-hidden="true">
                  <Icon size={16} />
                </span>
                <span className="settings-row-label">{label}</span>
                {meta && <span className="settings-row-meta">{meta}</span>}
                <ChevronRight size={15} className="settings-row-chevron" aria-hidden="true" />
              </div>
            );

            if (to) return <Link to={to} key={id} style={{ textDecoration: 'none' }}>{inner}</Link>;
            return <button type="button" key={id} className="settings-row-btn" onClick={() => {}}>{inner}</button>;
          })}

          {/* Log Out */}
          <button
            type="button"
            className="settings-row-btn"
            onClick={() => setShowLogout(true)}
          >
            <div className="settings-row settings-row-logout" role="listitem">
              <span className="settings-row-icon danger-icon" aria-hidden="true">
                <LogOut size={16} />
              </span>
              <span className="settings-row-label" style={{ color: '#D9463A' }}>Log Out</span>
            </div>
          </button>
        </div>
      </div>

      {/* Logout confirmation modal */}
      {showLogout && <LogoutModal onClose={() => setShowLogout(false)} />}

      <BottomNavigation />
    </div>
  );
}
