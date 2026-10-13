import { Search, X } from 'lucide-react';
import './SearchBar.css';

/**
 * A single, familiar search field (Jakob's Law: icon on the left, clear
 * affordance on the right). With only two facilities to find, this exists
 * mainly to let users jump straight to the one they have in mind — not to
 * introduce filters or categories (Hick's/Tesler's Law).
 */
export default function SearchBar({ value, onChange, inputRef, placeholder = 'Search library or gym...' }) {
  return (
    <div className="search-bar">
      <Search size={19} className="search-icon" aria-hidden="true" />
      <label htmlFor="facility-search" className="visually-hidden">
        Search campus spaces
      </label>
      <input
        id="facility-search"
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
