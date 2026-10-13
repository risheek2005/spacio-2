import './Toggle.css';

/**
 * Accessible switch control used for the two Profile settings. A real
 * <button role="switch"> rather than a styled checkbox hack, so it works
 * with keyboard (Enter/Space) and is announced correctly by screen readers.
 */
export default function Toggle({ checked, onChange, label, id }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      className={'toggle' + (checked ? ' toggle-on' : '')}
      onClick={() => onChange(!checked)}
      aria-label={label}
    >
      <span className="toggle-thumb" />
    </button>
  );
}
