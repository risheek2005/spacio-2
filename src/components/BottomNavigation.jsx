import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Map, Heart, User } from 'lucide-react';

/**
 * BottomNavigation — fixed 5-tab bar matching wireframe screens.
 * Active item shown in forest-green, inactive in muted grey.
 */
const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home',    Icon: Home,    match: (p) => p === '/dashboard' },
  { to: '/explore',   label: 'Explore', Icon: Compass, match: (p) => p === '/explore' },
  { to: '/map',       label: 'Map',     Icon: Map,     match: (p) => p.startsWith('/map') },
  { to: '/saved',     label: 'Saved',   Icon: Heart,   match: (p) => p === '/saved' },
  { to: '/profile',   label: 'Profile', Icon: User,    match: (p) => p === '/profile' || p.startsWith('/settings') || p.startsWith('/help') },
];

export default function BottomNavigation() {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {NAV_ITEMS.map(({ to, label, Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={label}
            to={to}
            className={`bottom-nav-item${active ? ' active' : ''}`}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
