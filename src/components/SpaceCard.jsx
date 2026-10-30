import { Link } from 'react-router-dom';
import { MapPin, Heart, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * SpaceCard — compact horizontal card used in Explore, Home, Map list view, and Saved.
 * Shows thumbnail, name, location, occupancy, availability, and save toggle.
 */
export default function SpaceCard({ facility, showSave = true }) {
  const { isSaved, toggleSaved } = useApp();
  const saved = isSaved(facility.id);

  const occ = facility.occupancy;
  const occTone = occ >= 75 ? 'high' : occ >= 40 ? 'moderate' : 'low';
  const occLabel = occ >= 75 ? 'High' : occ >= 40 ? 'Moderate' : 'Low';

  const statusClass =
    facility.status === 'Open' ? 'status-open' :
    facility.status === 'Busy' ? 'status-busy' : 'status-closed';

  return (
    <article style={{ position: 'relative' }}>
      <Link
        to={`/facility/${facility.id}`}
        className="space-card"
        aria-label={`${facility.name} — ${facility.status}, ${occ}% occupied. View details.`}
      >
        <img
          src={facility.image}
          alt={facility.name}
          className="space-card-img"
          loading="lazy"
          onError={(e) => { e.target.src = '/campus_hero.jpg'; }}
        />
        <div className="space-card-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
            <span className="space-card-name">{facility.name}</span>
            <span className={`status-badge ${statusClass}`} style={{ fontSize: '0.68rem', padding: '2px 7px', flexShrink: 0 }}>
              <span className="status-dot" />
              {facility.status}
            </span>
          </div>

          <div className="space-card-location">
            <MapPin size={11} aria-hidden="true" />
            <span>{facility.location}</span>
          </div>

          <div className="space-card-row">
            <span className="space-card-occ">{occ}% occupied</span>
            <span className="space-card-action">
              View Details <ChevronRight size={13} />
            </span>
          </div>

          {/* Occupancy mini-bar */}
          <div style={{ marginTop: 6 }}>
            <div className="occ-bar-track">
              <div
                className={`occ-bar-fill occ-${occTone}`}
                style={{ width: `${occ}%` }}
                role="progressbar"
                aria-valuenow={occ}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${occ}% occupied, ${occLabel} crowd`}
              />
            </div>
          </div>
        </div>
      </Link>

      {showSave && (
        <button
          type="button"
          className={`save-btn${saved ? ' saved' : ''}`}
          onClick={(e) => { e.preventDefault(); toggleSaved(facility.id); }}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${facility.name} from saved` : `Save ${facility.name}`}
          style={{ position: 'absolute', top: 8, right: 8 }}
        >
          <Heart size={14} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      )}
    </article>
  );
}
