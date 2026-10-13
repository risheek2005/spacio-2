import './StatusBadge.css';

/**
 * Weber's Law in practice: status differences must be immediately
 * noticeable, not just technically present. Each state gets its own
 * color AND its own word AND its own dot — never color alone — so the
 * signal survives for colorblind users and in bad lighting alike.
 */
const STATUS_MAP = {
  Open: { className: 'status-open', label: 'Open' },
  Busy: { className: 'status-moderate', label: 'Busy' },
  Moderate: { className: 'status-moderate', label: 'Moderate' },
  Closed: { className: 'status-closed', label: 'Closed' },
  Full: { className: 'status-closed', label: 'Full' },
};

export default function StatusBadge({ status, size = 'md' }) {
  const info = STATUS_MAP[status] || STATUS_MAP.Open;
  return (
    <span className={`status-badge ${info.className} status-badge-${size}`}>
      <span className="status-dot" aria-hidden="true" />
      {info.label}
    </span>
  );
}
