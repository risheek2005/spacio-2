import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, UserRound } from 'lucide-react';
import './Navbar.css';

/**
 * App navigation, used on every authenticated screen.
 *
 * Jakob's Law: logo top-left, nav in a predictable top position on
 * larger screens. On mobile it becomes a fixed bottom tab bar — the
 * convention people already know from the apps on their phone — which
 * also keeps the three destinations within easy thumb reach (Fitts's Law).
 *
 * Hick's Law: exactly three destinations, always in the same order.
 */
const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Home',
    icon: Home,
    isActive: (pathname, search) => pathname === '/dashboard' && !search.includes('explore'),
  },
  {
    to: '/dashboard?explore=1',
    label: 'Explore',
    icon: Compass,
    isActive: (pathname, search) => pathname === '/dashboard' && search.includes('explore'),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: UserRound,
    isActive: (pathname) => pathname === '/profile',
  },
];

export default function Navbar() {
  const { pathname, search } = useLocation();

  return (
    <>
      <header className="navbar-top">
        <div className="container navbar-inner">
          <Link to="/dashboard" className="navbar-brand" aria-label="Spacio home">
            <span className="brand-mark" aria-hidden="true">S</span>
            <span className="brand-word">Spacio</span>
          </Link>
          <nav className="navbar-links" aria-label="Primary">
            {NAV_ITEMS.map(({ to, label, icon: Icon, isActive }) => {
              const active = isActive(pathname, search);
              return (
                <Link
                  key={label}
                  to={to}
                  className={'navbar-link' + (active ? ' navbar-link-active' : '')}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <nav className="navbar-bottom" aria-label="Primary">
        {NAV_ITEMS.map(({ to, label, icon: Icon, isActive }) => {
          const active = isActive(pathname, search);
          return (
            <Link
              key={label}
              to={to}
              className={'navbar-bottom-link' + (active ? ' navbar-bottom-link-active' : '')}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={22} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
