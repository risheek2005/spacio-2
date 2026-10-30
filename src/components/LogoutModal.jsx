import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Screen 13 — Logout Confirmation Modal
 * Dimmed overlay with centered dialog: cancel or confirm logout.
 * On confirm: clears session → navigates to /logged-out.
 */
export default function LogoutModal({ onClose }) {
  const { logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/logged-out', { replace: true });
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
      aria-describedby="logout-desc"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-box">
        {/* Icon */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56,
            background: '#FFF0F0', borderRadius: '50%',
            margin: '0 auto 16px',
            color: '#D9463A',
          }}
          aria-hidden="true"
        >
          <LogOut size={24} />
        </div>

        <h2 id="logout-title" style={{
          fontFamily: 'var(--font-serif)', fontSize: '1.3rem',
          fontWeight: 700, marginBottom: 8, color: 'var(--color-text)',
        }}>
          Log out?
        </h2>

        <p id="logout-desc" style={{
          fontSize: '0.85rem', color: 'var(--color-text-secondary)',
          lineHeight: 1.6, marginBottom: 24,
        }}>
          Are you sure you want to log out of your SPACIO account?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleLogout}
            style={{ background: '#D9463A' }}
          >
            Log Out
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
