import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import ChatBot from './components/ChatBot';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import Filter from './pages/Filter';
import FacilityDetails from './pages/FacilityDetails';
import CampusMap from './pages/CampusMap';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import HelpSupport from './pages/HelpSupport';
import LoggedOut from './pages/LoggedOut';

/** Renders the ChatBot only when the user is authenticated */
function AuthenticatedChatBot() {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <ChatBot /> : null;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div id="main-content">
          <Routes>
            {/* Screen 01: Splash Screen */}
            <Route path="/" element={<Landing />} />

            {/* Screen 02 & 03: Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Screen 04: Home / Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/home" element={<Navigate to="/dashboard" replace />} />

            {/* Screen 05: Explore Spaces */}
            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <Explore />
                </ProtectedRoute>
              }
            />

            {/* Screen 06: Search & Filter */}
            <Route
              path="/filter"
              element={
                <ProtectedRoute>
                  <Filter />
                </ProtectedRoute>
              }
            />

            {/* Screen 07: Space Details */}
            <Route
              path="/facility/:id"
              element={
                <ProtectedRoute>
                  <FacilityDetails />
                </ProtectedRoute>
              }
            />

            {/* Screen 08 & 09: Campus Map (Map & List views) */}
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <CampusMap />
                </ProtectedRoute>
              }
            />

            {/* Screen 10: Saved Spaces */}
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <Saved />
                </ProtectedRoute>
              }
            />

            {/* Screen 11: Account Settings / Profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Screen 12: Help & Support */}
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <HelpSupport />
                </ProtectedRoute>
              }
            />

            {/* Screen 14: Logged Out confirmation screen */}
            <Route path="/logged-out" element={<LoggedOut />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Floating AI Campus Assistant — visible on all authenticated pages */}
        <AuthenticatedChatBot />
      </BrowserRouter>
    </AppProvider>
  );
}

