import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Heart, Clock, MapPin, Map,
  Dumbbell, Activity, Lock, Droplets, Droplet,
  Wifi, Wind, BatteryCharging, BookOpen, VolumeX,
  PenLine, MonitorPlay, Printer, Monitor, Mic, Volume2,
  Star,
} from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { useApp } from '../context/AppContext';
import { getFacilityById } from '../data/facilities';
import './FacilityDetails.css';

const ICON_MAP = {
  Dumbbell, Activity, Lock, Droplets, Droplet,
  Wifi, Wind, BatteryCharging, BookOpen, VolumeX,
  PenLine, MonitorPlay, Printer, Monitor, Mic, Volume2,
  Star,
};

function getOccupancyDescription(occ) {
  if (occ < 30) return 'Room to move';
  if (occ < 60) return 'Moderate activity';
  if (occ < 80) return 'Getting busy';
  return 'Very crowded';
}

/**
 * Screen 07 — Space Details
 * Hero image, name, status, hours, save button, occupancy bar,
 * facilities icons, about section, "View on Campus Map" button.
 */
export default function FacilityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSaved } = useApp();
  const facility = getFacilityById(id);

  if (!facility) {
    return (
      <div className="page page-with-nav">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 12 }}>Space not found</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>We couldn't find that campus space.</p>
          <button type="button" className="btn-primary" onClick={() => navigate('/explore')} style={{ width: 'auto', padding: '12px 24px' }}>
            Explore Spaces
          </button>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const saved = isSaved(facility.id);
  const occ = facility.occupancy;
  const occTone = occ >= 75 ? 'high' : occ >= 40 ? 'moderate' : 'low';
  const statusClass = facility.status === 'Open' ? 'status-open' : facility.status === 'Busy' ? 'status-busy' : 'status-closed';

  return (
    <div className="page page-with-nav">
      <div className="details-page">
        {/* Hero image with back + save overlays */}
        <div className="details-hero">
          <img
            src={facility.image}
            alt={facility.name}
            className="details-hero-img"
            onError={(e) => { e.target.src = '/campus_hero.jpg'; }}
          />
          <button
            type="button"
            className="details-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            className={`details-save-btn${saved ? ' saved' : ''}`}
            onClick={() => toggleSaved(facility.id)}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${facility.name} from saved` : `Save ${facility.name}`}
          >
            <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Content */}
        <div className="details-content">
          {/* Name + status */}
          <div className="details-title-row">
            <div>
              <h1 className="details-name">{facility.name}</h1>
              <div className="details-location">
                <MapPin size={12} aria-hidden="true" />
                <span>{facility.location}</span>
              </div>
            </div>
            <span className={`status-badge ${statusClass}`}>
              <span className="status-dot" />
              {facility.status}
            </span>
          </div>

          {/* Hours */}
          <div className="details-hours">
            <Clock size={13} aria-hidden="true" />
            <span>{facility.hours}</span>
          </div>

          {/* Occupancy */}
          <div className="details-occupancy-card">
            <div className="details-occ-row">
              <span className="details-occ-pct">{occ}% occupied</span>
              <span className="details-occ-desc">{getOccupancyDescription(occ)}</span>
            </div>
            <div className="occ-bar-track" style={{ height: 7, marginTop: 8 }}>
              <div
                className={`occ-bar-fill occ-${occTone}`}
                style={{ width: `${occ}%` }}
                role="progressbar"
                aria-valuenow={occ}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${occ}% occupied`}
              />
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
              Capacity: {facility.capacity} people
            </p>
          </div>

          {/* Facilities / Amenities */}
          <section className="details-section" aria-labelledby="facilities-heading">
            <h2 id="facilities-heading" className="details-section-title">Facilities</h2>
            <div className="details-amenities-grid">
              {facility.amenities.map((amenity) => {
                const iconKey = facility.amenityIcons?.[amenity];
                const Icon = ICON_MAP[iconKey] || Star;
                return (
                  <div key={amenity} className="details-amenity-item">
                    <span className="details-amenity-icon" aria-hidden="true">
                      <Icon size={16} />
                    </span>
                    <span className="details-amenity-label">{amenity}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* About */}
          <section className="details-section" aria-labelledby="about-heading">
            <h2 id="about-heading" className="details-section-title">About this space</h2>
            <p className="details-about-text">{facility.about}</p>
          </section>

          {/* Map CTA */}
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate(`/map?highlight=${facility.id}`)}
            style={{ marginTop: 8 }}
          >
            <Map size={16} aria-hidden="true" />
            View on Campus Map
          </button>

          <p className="details-demo-note">
            Occupancy is illustrative demo data for this UI/UX project.
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
