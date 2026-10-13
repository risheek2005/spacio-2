import { Link } from 'react-router-dom';
import './Button.css';

/**
 * Shared button primitive. Deliberately generous in padding/min-height
 * (Fitts's Law) so every primary action — Sign In, Explore Spacio,
 * View details — is an easy, confident target on touch and mouse alike.
 *
 * Renders a <Link> when `to` is provided (keeps semantics correct for
 * navigation vs. `<button>` for in-page actions), otherwise a <button>.
 */
export default function Button({
  as,
  to,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="btn-icon" size={18} aria-hidden="true" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="btn-icon" size={18} aria-hidden="true" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  const Component = as || 'button';
  return (
    <Component className={classes} {...rest}>
      {content}
    </Component>
  );
}
