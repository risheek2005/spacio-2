import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, SlidersHorizontal, ChevronRight, Dumbbell, BookOpen, BookMarked, FlaskConical, Mic, MoreHorizontal } from 'lucide-react';
import SpacioLogo from '../components/SpacioLogo';
import BottomNavigation from '../components/BottomNavigation';
import SpaceCard from '../components/SpaceCard';
import { useApp } from '../context/AppContext';
import { FACILITIES } from '../data/facilities';
import './Dashboard.css';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const CATEGORIES = [
  { label: 'Gym',        icon: Dumbbell,      id: 'Gym' },
  { label: 'Library',    icon: BookOpen,       id: 'Library' },
  { label: 'Study Room', icon: BookMarked,     id: 'Study Room' },
  { label: 'Labs',       icon: FlaskConical,   id: 'Labs' },
  { label: 'Auditorium', icon: Mic,            id: 'Auditorium' },
  { label: 'Other',      icon: MoreHorizontal, id: 'Other' },
];

/**
 * Screen 04 — Home Page
 * Greeting, search bar, category grid, "Around you" space cards.
 */
export default function Dashboard() {
  const { user } = useApp();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const firstName = user?.name?.split(' ')[0] || 'there';

  const nearby = useMemo(() => {
    let results = FACILITIES;
    if (activeCategory) {
      results = results.filter((f) => f.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.location.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }
    return results;
  }, [query, activeCategory]);

  return (
    <div className="page page-with-nav">
      <div className="dashboard-page">
        {/* Top bar */}
        <header className="dashboard-topbar">
          <SpacioLogo to="/dashboard" size="sm" />
          <button className="notif-btn" aria-label="Notifications">
            <Bell size={19} />
            <span className="notif-dot" aria-hidden="true" />
          </button>
        </header>

        {/* Greeting */}
        <section className="dashboard-greeting" aria-label="Greeting">
          <p className="text-eyebrow">YOUR CAMPUS, YOUR PACE</p>
          <h1 className="dashboard-greeting-title">
            {getGreeting()},&nbsp;{firstName}
          </h1>
        </section>

        {/* Search */}
        <div className="dashboard-search">
          <div className="search-bar" role="search">
            <Search size={16} className="search-icon" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search campus spaces"
              aria-label="Search campus spaces"
            />
            <Link to="/explore" className="filter-btn" aria-label="Advanced filters">
              <SlidersHorizontal size={14} />
            </Link>
          </div>
        </div>

        {/* Find your space — category grid */}
        <section className="dashboard-section" aria-labelledby="cats-heading">
          <h2 id="cats-heading" className="dashboard-section-title">Find your space</h2>
          <div className="category-grid">
            {CATEGORIES.map(({ label, icon: Icon, id }) => (
              <button
                key={id}
                type="button"
                className={`category-card${activeCategory === id ? ' active' : ''}`}
                onClick={() => setActiveCategory(activeCategory === id ? null : id)}
                aria-pressed={activeCategory === id}
              >
                <span className="category-card-icon" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <span className="category-card-label">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Around you */}
        <section className="dashboard-section" aria-labelledby="nearby-heading">
          <div className="dashboard-section-header">
            <h2 id="nearby-heading" className="dashboard-section-title">Around you</h2>
            <Link to="/explore" className="explore-all-link">
              Explore all <ChevronRight size={14} />
            </Link>
          </div>

          {nearby.length === 0 ? (
            <div className="empty-state">
              <p>No spaces match your search.</p>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => { setQuery(''); setActiveCategory(null); }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="dashboard-spaces-list">
              {nearby.map((f) => (
                <SpaceCard key={f.id} facility={f} />
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNavigation />
    </div>
  );
}
