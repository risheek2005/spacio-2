import { Link } from 'react-router-dom';
import { Heart, ChevronRight, ArrowUpDown } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import SpaceCard from '../components/SpaceCard';
import { useApp } from '../context/AppContext';
import { FACILITIES } from '../data/facilities';
import './Saved.css';

/**
 * Screen 10 — Saved Spaces
 * Lists user's favourited spaces with occupancy and View Details.
 * Shows empty state with call to action when nothing is saved.
 */
export default function SavedSpaces() {
  const { savedFacilityIds } = useApp();
  const savedFacilities = FACILITIES.filter((f) => savedFacilityIds.includes(f.id));

  return (
    <div className="page page-with-nav">
      <div className="saved-page">
        {/* Header */}
        <header className="saved-header">
          <div>
            <h1 className="saved-title">Saved Spaces</h1>
            <p className="saved-subtitle">Your campus favourites</p>
          </div>
          {savedFacilities.length > 0 && (
            <button type="button" className="btn-ghost" style={{ padding: '6px 8px' }}>
              <ArrowUpDown size={14} />
            </button>
          )}
        </header>

        {savedFacilities.length === 0 ? (
          /* Empty state */
          <div className="saved-empty">
            <div className="saved-empty-icon" aria-hidden="true">
              <Heart size={32} />
            </div>
            <h2 className="saved-empty-title">No saved spaces yet</h2>
            <p className="saved-empty-desc">
              Tap the heart icon on any space to save it here for quick access.
            </p>
            <Link to="/explore" className="btn-primary" style={{ width: 'auto', display: 'inline-flex', padding: '12px 24px' }}>
              Explore Spaces
            </Link>
          </div>
        ) : (
          /* Saved list */
          <div className="saved-body">
            <p className="saved-count">
              {savedFacilities.length} space{savedFacilities.length !== 1 ? 's' : ''} saved
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {savedFacilities.map((f) => (
                <SpaceCard key={f.id} facility={f} showSave={true} />
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
