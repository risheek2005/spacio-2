import './OccupancyBar.css';

/**
 * A deliberately simple status indicator. The number, text label and bar
 * reinforce one another so the user does not have to decode a chart.
 * This supports Tesler, Miller and Weber without adding complexity.
 */
export default function OccupancyBar({ occupancy, crowd }) {
  const tone = occupancy >= 75 ? 'high' : occupancy >= 40 ? 'moderate' : 'low';

  return (
    <div className="occupancy">
      <div className="occupancy-labels">
        <span className="occupancy-percent">{occupancy}% occupied</span>
        <span className="occupancy-crowd">{crowd} crowd</span>
      </div>
      <div
        className="occupancy-track"
        role="progressbar"
        aria-valuenow={occupancy}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${occupancy}% occupied, ${crowd} crowd`}
        aria-label={`Current occupancy ${occupancy} percent, ${crowd} crowd level`}
      >
        <div className={`occupancy-fill occupancy-fill-${tone}`} style={{ width: `${occupancy}%` }} />
      </div>
    </div>
  );
}
