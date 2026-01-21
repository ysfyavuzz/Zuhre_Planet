/**
 * Application Entry Point (main.tsx)
 * 
 * Main application initialization and React DOM rendering.
 * Wraps the entire application with necessary providers and middleware.
 * Handles age verification modal and application-level setup.
 * 
 * @module main
 * @category Application
 * 
 * Features:
 * - Application provider stack (tRPC, Theme, Auth, Router)
 * - Age verification modal system
 * - Error boundary for error handling
 * - Strict mode for development warnings
 * - localStorage-based age verification persistence
 * 
 * Provider Stack (top-level to bottom):
 * 1. ErrorBoundary: Catches React component errors
 * 2. TRPCProvider: tRPC client and React Query
 * 3. ThemeProvider: Theme context (dark/light mode)
 * 4. AuthProvider: Authentication context
 * 5. Router: wouter routing
 * 
 * Features:
 * - Age gate verification (VITE_ENABLE_AGE_VERIFICATION)
 * - Persistent age verification in localStorage
 * - Global error catching and display
 * - React strict mode for development
 * 
 * Age Verification:
 * - Can be disabled via VITE_ENABLE_AGE_VERIFICATION='false'
 * - Stored in localStorage as 'age-verified'
 * - Shows modal overlay until verified
 * - Once verified, never shown again (same session)
 * 
 * Environment Variables:
 * - VITE_ENABLE_AGE_VERIFICATION: Enable/disable age gate (default: true)
 * - VITE_API_URL: Backend API URL (used in tRPC client)
 * 
 * @example
 * ```typescript
 * // In index.html:
 * <div id="root"></div>
 * 
 * // The root component will:
 * 1. Show age verification if needed
 * 2. Initialize all providers
 * 3. Render the App component
 * 4. Catch any errors in an error boundary
 * ```
 * 
 * CSS:
 * - Global styles imported from './index.css'
 * - Tailwind CSS configured in tailwind.config.js
 * 
 * @todo Implement persistent age verification across sessions
 * @todo Add analytics tracking
 * @todo Add telemetry/error reporting
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from 'wouter';

// Providers
import { TRPCProvider } from './lib/trpc';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import AgeVerification from './components/AgeVerification';
import RoleSelector from './components/RoleSelector';
import App from './pages/App';

// Styles
import './index.css';

// Check if we should show age verification
const shouldShowAgeVerification = import.meta.env.VITE_ENABLE_AGE_VERIFICATION !== 'false';

// Root component with all providers
function Root() {
  const [showAgeVerification, setShowAgeVerification] = React.useState(shouldShowAgeVerification);
  const [isAgeVerified, setIsAgeVerified] = React.useState(() => {
    return localStorage.getItem('age-verified') !== null;
  });
  const [showRoleSelector, setShowRoleSelector] = React.useState(false);

  React.useEffect(() => {
    if (isAgeVerified) {
      setShowAgeVerification(false);
      // Check if role selection is needed
      const storedRole = localStorage.getItem('user-role-selection');
      const roleDate = localStorage.getItem('role-selection-date');
      const isRoleValid = roleDate && (Date.now() - parseInt(roleDate)) < (7 * 24 * 60 * 60 * 1000);

      if (!storedRole || !isRoleValid) {
        // Show role selector if not yet selected or expired
        setTimeout(() => setShowRoleSelector(true), 500);
      }
    }
  }, [isAgeVerified]);

  const handleAgeConfirm = () => {
    setIsAgeVerified(true);
    setShowAgeVerification(false);
  };

  const handleRoleSelect = () => {
    setShowRoleSelector(false);
  };

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <TRPCProvider>
          <ThemeProvider>
            <AuthProvider>
              <Router>
                <App />
              </Router>

              {/* Age Verification Modal */}
              {showAgeVerification && (
                <AgeVerification onConfirm={handleAgeConfirm} />
              )}

              {/* Role Selection Modal */}
              {showRoleSelector && (
                <RoleSelector onRoleSelect={handleRoleSelect} />
              )}
            </AuthProvider>
          </ThemeProvider>
        </TRPCProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
