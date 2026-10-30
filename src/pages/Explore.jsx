import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import SpaceCard from '../components/SpaceCard';
import { FACILITIES } from '../data/facilities';
import './Explore.css';

const FILTER_CHIPS = ['All spaces', 'Open now', 'Near me'];

/**
 * Screen 05 — Explore Spaces
 * Search, category chips, result count, sorting, and space cards.
 */
export default function Explore() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All spaces');

  const filtered = useMemo(() => {
    let result = FACILITIES;
    if (activeFilter === 'Open now') {
      result = result.filter((f) => f.status === 'Open');
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.location.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [query, activeFilter]);

  return (
    <div className="page page-with-nav">
      <div className="explore-page">
        {/* Header */}
        <header className="explore-header">
          <h1 className="explore-title">Explore Spaces</h1>
        </header>

        {/* Search */}
        <div className="search-bar" role="search" style={{ marginBottom: 16 }}>
          <Search size={16} className="search-icon" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a campus space"
            aria-label="Search campus spaces"
          />
          <Link to="/filter" className="filter-btn" aria-label="Filters">
            <SlidersHorizontal size={14} />
          </Link>
        </div>

        {/* Filter chips */}
        <div className="chips-row" style={{ marginBottom: 16 }}>
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className={`chip${activeFilter === chip ? ' active' : ''}`}
              onClick={() => setActiveFilter(chip)}
              aria-pressed={activeFilter === chip}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Result count + sort */}
        <div className="explore-results-bar">
          <span className="explore-count">
            {filtered.length} space{filtered.length !== 1 ? 's' : ''} found
          </span>
          <button type="button" className="btn-ghost explore-sort-btn" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
            <ArrowUpDown size={12} />
            Nearest first
          </button>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No spaces match your search.</p>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => { setQuery(''); setActiveFilter('All spaces'); }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="explore-list">
            {filtered.map((f) => (
              <SpaceCard key={f.id} facility={f} />
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
