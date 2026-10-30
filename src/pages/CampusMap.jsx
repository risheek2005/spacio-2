import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Map as MapIcon, List, Settings2, MapPin } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import SpaceCard from '../components/SpaceCard';
import { FACILITIES } from '../data/facilities';
import './CampusMap.css';

/**
 * Screens 08 & 09 — Campus Map + Map List View
 * Illustrative map with clickable markers, toggle between Map/List view.
 * Map positions are % coordinates on the campus background illustration.
 */
export default function CampusMap() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlight = searchParams.get('highlight');
  const [view, setView] = useState('map');
  const [selectedId, setSelectedId] = useState(highlight || null);

  const selected = FACILITIES.find((f) => f.id === selectedId);
  const occ = selected?.occupancy;

  const getMarkerClass = (f) => {
    if (f.status === 'Open' && f.occupancy < 40) return 'marker-low';
    if (f.status === 'Open' && f.occupancy < 75) return 'marker-moderate';
    return 'marker-high';
  };

  return (
    <div className="page page-with-nav">
      <div className="map-page">
        {/* Header */}
        <header className="map-header">
          <h1 className="map-title">
            {view === 'map' ? 'Campus Map' : 'Campus Spaces'}
          </h1>
          <div className="map-toggle-group" role="group" aria-label="View toggle">
            <button
              type="button"
              className={`map-toggle-btn${view === 'map' ? ' active' : ''}`}
              onClick={() => setView('map')}
              aria-pressed={view === 'map'}
            >
              <MapIcon size={14} />
              Map View
            </button>
            <button
              type="button"
              className={`map-toggle-btn${view === 'list' ? ' active' : ''}`}
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
            >
              <List size={14} />
              List View
            </button>
          </div>
        </header>

        {view === 'map' ? (
          /* ── MAP VIEW ── */
          <div className="map-body">
            {/* Illustrative campus map */}
            <div className="campus-map-canvas" aria-label="Interactive campus map">
              {/* Map background */}
              <img
                src="/campus_hero.jpg"
                alt="Campus aerial view"
                className="campus-map-bg"
              />
              {/* Overlay grid */}
              <div className="campus-map-overlay" />

              {/* Markers */}
              {FACILITIES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`map-marker ${getMarkerClass(f)}${selectedId === f.id ? ' selected' : ''}`}
                  style={{ left: `${f.mapPosition.x}%`, top: `${f.mapPosition.y}%` }}
                  onClick={() => setSelectedId(f.id === selectedId ? null : f.id)}
                  aria-label={`${f.name}: ${f.occupancy}% occupied`}
                  aria-pressed={selectedId === f.id}
                >
                  <MapPin size={14} aria-hidden="true" />
                  <span className="marker-label">{f.name}</span>
                  <span className="marker-occ">{f.occupancy}%</span>
                </button>
              ))}
            </div>

            {/* Map controls */}
            <button type="button" className="map-settings-btn" aria-label="Map settings">
              <Settings2 size={16} />
            </button>

            {/* Selected space preview */}
            {selected && (
              <div className="map-selected-card">
                <SpaceCard facility={selected} showSave={true} />
              </div>
            )}

            {/* Legend */}
            <div className="map-legend">
              <span className="legend-item">
                <span className="legend-dot legend-low" />
                Available
              </span>
              <span className="legend-item">
                <span className="legend-dot legend-moderate" />
                Moderate
              </span>
              <span className="legend-item">
                <span className="legend-dot legend-high" />
                Busy
              </span>
            </div>
          </div>
        ) : (
          /* ── LIST VIEW ── */
          <div className="map-list-body">
            <p className="map-list-subtitle">
              Nearby locations · {FACILITIES.length} spaces
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FACILITIES.map((f) => (
                <SpaceCard key={f.id} facility={f} />
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
