import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * Guards authenticated pages (Dashboard, Facility Details, Profile).
 * There is no real backend — this simply checks the mock session stored
 * in AppContext/localStorage — but it keeps the intended flow honest:
 * Landing → Auth → Dashboard, not Dashboard first.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
