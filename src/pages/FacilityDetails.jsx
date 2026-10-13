import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Heart,
  Wifi,
  Snowflake,
  BatteryCharging,
  Armchair,
  Dumbbell,
  Shirt,
  Droplet,
  Check,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import OccupancyBar from '../components/OccupancyBar';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { getFacilityById } from '../data/facilities';
import './FacilityDetails.css';

const AMENITY_ICONS = {
  'Wi-Fi': Wifi,
  AC: Snowflake,
  Charging: BatteryCharging,
  'Study Tables': Armchair,
  Equipment: Dumbbell,
  'Changing Room': Shirt,
  'Water Station': Droplet,
};

/**
 * One reusable details layout for both Library and Gym.
 * The page is intentionally chunked into Status → Details → Amenities.
 * This makes the important information easy to scan without introducing
 * extra controls or decisions.
 */
export default function FacilityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSaved } = useApp();
  const facility = getFacilityById(id);

  if (!facility) {
    return (
      <div className="page">
        <Navbar />
        <main className="container details-not-found">
          <h1>Space not found</h1>
          <p>We couldn't find that campus space.</p>
          <Button to="/dashboard" variant="primary">
            Back to Dashboard
          </Button>
        </main>
      </div>
    );
  }

  const saved = isSaved(facility.id);

  return (
    <div className="page">
      <Navbar />

      <main className="details-main">
        <div className="container details-container">
          <button type="button" className="details-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} aria-hidden="true" /> Back
          </button>

          <header className="details-header">
            <div className="details-heading">
              <p className="eyebrow">Campus space</p>
              <h1>{facility.name}</h1>
              <p className="details-location">
                <MapPin size={15} aria-hidden="true" />
                {facility.location}
              </p>
            </div>
            <button
              type="button"
              className={'save-btn save-btn-lg' + (saved ? ' save-btn-active' : '')}
              onClick={() => toggleSaved(facility.id)}
              aria-pressed={saved}
              aria-label={saved ? `Remove ${facility.name} from saved spaces` : `Save ${facility.name}`}
            >
              <Heart size={20} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
            </button>
          </header>

          <section className="details-section details-status-section" aria-label="Current availability">
            <div className="details-status-row">
              <div>
                <p className="details-kicker">Current status</p>
                <div className="details-status-value">
                  <StatusBadge status={facility.status} size="lg" />
                  <span className="details-blurb">{facility.blurb}</span>
                </div>
              </div>
            </div>
            <OccupancyBar occupancy={facility.occupancy} crowd={facility.crowd} />
          </section>

          <section className="details-section" aria-labelledby="details-heading">
            <h2 id="details-heading" className="details-section-title">
              Details
            </h2>
            <div className="details-grid">
              <div className="detail-item">
                <Clock size={18} aria-hidden="true" className="detail-item-icon" />
                <div>
                  <p className="detail-item-label">Opening Hours</p>
                  <p className="detail-item-value">{facility.hours}</p>
                </div>
              </div>
              <div className="detail-item">
                <MapPin size={18} aria-hidden="true" className="detail-item-icon" />
                <div>
                  <p className="detail-item-label">Location</p>
                  <p className="detail-item-value">{facility.location}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="details-section" aria-labelledby="amenities-heading">
            <h2 id="amenities-heading" className="details-section-title">
              Amenities
            </h2>
            <ul className="amenities-grid">
              {facility.amenities.map((amenity) => {
                const Icon = AMENITY_ICONS[amenity] || Check;
                return (
                  <li key={amenity} className="amenity-item">
                    <Icon size={17} aria-hidden="true" />
                    <span>{amenity}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <p className="demo-note details-demo-note">
            Occupancy and status are demo data for this UI/UX project.
          </p>

          <div className="details-actions">
            <Button
              as="button"
              variant={saved ? 'secondary' : 'primary'}
              size="lg"
              icon={Heart}
              onClick={() => toggleSaved(facility.id)}
            >
              {saved ? 'Saved' : 'Save space'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
