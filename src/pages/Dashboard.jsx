import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import FacilityCard from '../components/FacilityCard';
import { useApp } from '../context/AppContext';
import { FACILITIES } from '../data/facilities';
import './Dashboard.css';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * The dashboard is deliberately focused on the two decisions Spacio asks
 * the user to make: find Library or Gym, then check its current condition.
 * This keeps the most useful information visible without adding filters,
 * charts or extra categories.
 */
export default function Dashboard() {
  const { user } = useApp();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    if (location.search.includes('explore')) {
      searchRef.current?.focus();
      searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [location.search]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FACILITIES;
    return FACILITIES.filter(
      (facility) =>
        facility.name.toLowerCase().includes(q) ||
        facility.location.toLowerCase().includes(q)
    );
  }, [query]);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="page dashboard">
      <Navbar />

      <main className="dashboard-main" id="dashboard-main-content">
        <div className="container dashboard-container">
          <section className="dashboard-greeting">
            <p className="eyebrow">Campus spaces</p>
            <h1>
              {getGreeting()}, {firstName} 👋
            </h1>
            <p>Find the right space for you.</p>
          </section>

          <section className="dashboard-search" aria-label="Search campus spaces">
            <SearchBar value={query} onChange={setQuery} inputRef={searchRef} />
          </section>

          <section className="dashboard-spaces" aria-labelledby="spaces-heading">
            <div className="dashboard-spaces-heading">
              <div>
                <h2 id="spaces-heading" className="dashboard-spaces-title">
                  Campus Spaces
                </h2>
                <p className="dashboard-spaces-subtitle">
                  {filtered.length === 2 ? '2 spaces available' : `${filtered.length} space${filtered.length === 1 ? '' : 's'} found`}
                </p>
              </div>
              <p className="demo-note">Demo availability</p>
            </div>

            {filtered.length === 0 ? (
              <p className="dashboard-empty" role="status">
                No spaces match “{query}”. Try “library” or “gym”.
              </p>
            ) : (
              <div className="facility-grid">
                {filtered.map((facility) => (
                  <FacilityCard key={facility.id} facility={facility} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
