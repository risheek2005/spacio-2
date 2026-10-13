import { Link } from 'react-router-dom';
import { MapPin, Heart, ArrowRight, BookOpen, Dumbbell } from 'lucide-react';
import StatusBadge from './StatusBadge';
import OccupancyBar from './OccupancyBar';
import { useApp } from '../context/AppContext';
import './FacilityCard.css';

const FACILITY_ICONS = {
  library: BookOpen,
  gym: Dumbbell,
};

/**
 * One reusable facility card for both spaces.
 *
 * Fitts: the main card/link is a large target and the save control is a
 * separate 44px target.
 * Proximity + Miller: information is grouped into small, predictable
 * chunks, with only three amenities shown here.
 * Pareto: status, crowd and occupancy appear before secondary details.
 */
export default function FacilityCard({ facility }) {
  const { isSaved, toggleSaved } = useApp();
  const saved = isSaved(facility.id);
  const Icon = FACILITY_ICONS[facility.id] || BookOpen;

  return (
    <article className="facility-card-shell">
      <Link
        to={`/facility/${facility.id}`}
        className="facility-card-link"
        aria-label={`${facility.name}, ${facility.location}. ${facility.status}, ${facility.crowd} crowd, ${facility.occupancy} percent occupancy. View details.`}
      >
        <div className="facility-card-icon" aria-hidden="true">
          <Icon size={20} />
        </div>

        <div className="facility-card-header">
          <div>
            <h3 className="facility-name">{facility.name}</h3>
            <p className="facility-location">
              <MapPin size={14} aria-hidden="true" />
              {facility.location}
            </p>
          </div>
        </div>

        <div className="facility-card-status-row">
          <StatusBadge status={facility.status} />
          <span className="facility-crowd-text">{facility.crowd} crowd</span>
        </div>

        <OccupancyBar occupancy={facility.occupancy} crowd={facility.crowd} />

        <ul className="facility-amenities" aria-label="Amenities">
          {facility.amenities.slice(0, 3).map((amenity) => (
            <li key={amenity}>{amenity}</li>
          ))}
          {facility.amenities.length > 3 && <li>+{facility.amenities.length - 3} more</li>}
        </ul>

        <div className="facility-card-footer">
          <span className="view-details-affordance">
            View details
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </Link>

      <button
        type="button"
        className={'save-btn' + (saved ? ' save-btn-active' : '')}
        onClick={() => toggleSaved(facility.id)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${facility.name} from saved spaces` : `Save ${facility.name}`}
      >
        <Heart size={19} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
      </button>
    </article>
  );
}
