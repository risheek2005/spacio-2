import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Single app-wide context for Spacio's demo state:
 *  - auth (mock, no backend — accepts any valid-looking email/password)
 *  - saved / favorited facilities
 *  - simple settings (dark mode, notifications)
 *
 * Everything persists to localStorage so a refresh keeps the user "logged in".
 * This is intentionally the ONLY piece of client state in the app — there is
 * no backend, so this context stands in for one.
 */

const STORAGE_KEY = 'spacio_state_v1';

const AppContext = createContext(null);

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* localStorage unavailable — demo app degrades to in-memory only */
  }
}

const defaultState = {
  user: null, // { name, email }
  savedFacilityIds: [],
  darkMode: false,
  notifications: true,
};

export function AppProvider({ children }) {
  const [state, setState] = useState(() => ({ ...defaultState, ...loadState() }));

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
  }, [state.darkMode]);

  const value = useMemo(() => {
    const login = ({ email, name }) => {
      setState((s) => ({
        ...s,
        user: { name: name || email.split('@')[0], email },
      }));
    };

    const logout = () => {
      setState((s) => ({ ...s, user: null }));
    };

    const toggleSaved = (facilityId) => {
      setState((s) => {
        const isSaved = s.savedFacilityIds.includes(facilityId);
        return {
          ...s,
          savedFacilityIds: isSaved
            ? s.savedFacilityIds.filter((id) => id !== facilityId)
            : [...s.savedFacilityIds, facilityId],
        };
      });
    };

    const toggleDarkMode = () => setState((s) => ({ ...s, darkMode: !s.darkMode }));
    const toggleNotifications = () => setState((s) => ({ ...s, notifications: !s.notifications }));

    return {
      user: state.user,
      isAuthenticated: Boolean(state.user),
      login,
      logout,
      savedFacilityIds: state.savedFacilityIds,
      isSaved: (id) => state.savedFacilityIds.includes(id),
      toggleSaved,
      darkMode: state.darkMode,
      toggleDarkMode,
      notifications: state.notifications,
      toggleNotifications,
    };
  }, [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
