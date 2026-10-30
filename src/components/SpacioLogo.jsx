import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

/**
 * SpacioLogo — botanical leaf symbol + Lora serif wordmark.
 * Matches the wireframe brand identity precisely.
 */
export default function SpacioLogo({ to = '/', size = 'md', className = '' }) {
  const leafSize = size === 'lg' ? 20 : size === 'sm' ? 14 : 16;
  const wrapSize = size === 'lg' ? 36 : size === 'sm' ? 24 : 28;
  const fontSize = size === 'lg' ? '1.4rem' : size === 'sm' ? '0.95rem' : '1.15rem';

  const inner = (
    <span
      className={`spacio-brand ${className}`}
      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      <span
        className="spacio-brand-leaf"
        aria-hidden="true"
        style={{ width: wrapSize, height: wrapSize }}
      >
        <Leaf size={leafSize} strokeWidth={2.2} />
      </span>
      <span
        className="spacio-brand-word"
        style={{ fontSize, letterSpacing: '-0.01em' }}
      >
        SPACIO
      </span>
    </span>
  );

  if (!to) return inner;

  return (
    <Link to={to} aria-label="SPACIO home" style={{ textDecoration: 'none' }}>
      {inner}
    </Link>
  );
}
