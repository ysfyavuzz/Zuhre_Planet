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

  React.useEffect(() => {
    if (isAgeVerified) {
      setShowAgeVerification(false);
    }
  }, [isAgeVerified]);

  const handleAgeConfirm = () => {
    setIsAgeVerified(true);
    setShowAgeVerification(false);
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
            </AuthProvider>
          </ThemeProvider>
        </TRPCProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
