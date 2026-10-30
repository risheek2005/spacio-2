import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, RotateCcw } from 'lucide-react';
import SpaceCard from '../components/SpaceCard';
import { FACILITIES } from '../data/facilities';
import './Filter.css';

const SPACE_TYPES = ['All', 'Gym', 'Library', 'Study Room', 'Labs', 'Auditorium'];
const AVAILABILITY = ['All', 'Open now', 'Busy', 'Closed'];

/**
 * Screen 06 — Search & Filter
 * Dedicated filter page with space type, availability, and occupancy slider.
 */
export default function FilterPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [spaceType, setSpaceType] = useState('All');
  const [availability, setAvailability] = useState('All');
  const [maxOccupancy, setMaxOccupancy] = useState(100);

  const filtered = FACILITIES.filter((f) => {
    if (spaceType !== 'All' && f.category !== spaceType) return false;
    if (availability !== 'All' && f.status !== availability) return false;
    if (f.occupancy > maxOccupancy) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      if (!f.name.toLowerCase().includes(q) && !f.location.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleReset = () => {
    setQuery('');
    setSpaceType('All');
    setAvailability('All');
    setMaxOccupancy(100);
  };

  return (
    <div className="filter-page">
      {/* Header */}
      <header className="filter-header">
        <button
          type="button"
          className="filter-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="filter-title">Search & Filter</h1>
        <button type="button" className="filter-reset-btn" onClick={handleReset}>
          <RotateCcw size={14} />
          Reset All
        </button>
      </header>

      <div className="filter-body">
        {/* Search */}
        <div className="search-bar" role="search" style={{ marginBottom: 24 }}>
          <Search size={16} className="search-icon" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a campus space"
            aria-label="Search campus spaces"
          />
        </div>

        {/* Space type */}
        <section className="filter-section" aria-labelledby="type-label">
          <h2 id="type-label" className="filter-section-label">Space type</h2>
          <div className="chips-row">
            {SPACE_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                className={`chip${spaceType === t ? ' active' : ''}`}
                onClick={() => setSpaceType(t)}
                aria-pressed={spaceType === t}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Availability */}
        <section className="filter-section" aria-labelledby="avail-label">
          <h2 id="avail-label" className="filter-section-label">Availability</h2>
          <div className="chips-row">
            {AVAILABILITY.map((a) => (
              <button
                key={a}
                type="button"
                className={`chip${availability === a ? ' active' : ''}`}
                onClick={() => setAvailability(a)}
                aria-pressed={availability === a}
              >
                {a}
              </button>
            ))}
          </div>
        </section>

        {/* Occupancy */}
        <section className="filter-section" aria-labelledby="occ-label">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 id="occ-label" className="filter-section-label" style={{ margin: 0 }}>Max occupancy</h2>
            <span className="filter-occ-value">{maxOccupancy}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={maxOccupancy}
            onChange={(e) => setMaxOccupancy(Number(e.target.value))}
            className="filter-slider"
            aria-label={`Max occupancy: ${maxOccupancy}%`}
          />
          <div className="filter-slider-labels">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </section>

        {/* Results */}
        <section className="filter-section" aria-label="Filtered results">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 className="filter-section-label" style={{ margin: 0 }}>
              {filtered.length} space{filtered.length !== 1 ? 's' : ''} found
            </h2>
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>No spaces match your filters.</p>
              <button type="button" className="btn-ghost" onClick={handleReset}>
                Reset filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map((f) => (
                <SpaceCard key={f.id} facility={f} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
