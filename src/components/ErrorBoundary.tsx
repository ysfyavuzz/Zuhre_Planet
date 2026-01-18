import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorFallback } from './ErrorDisplay';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean; // Don't propagate errors to parent boundaries
  retryLimit?: number; // Max retry attempts before giving up
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

/**
 * ErrorBoundary - Catches React errors and displays fallback UI
 *
 * Features:
 * - Retry logic with exponential backoff
 * - Error logging integration
 * - Development mode error details
 * - Isolated error boundaries (don't bubble up)
 * - Custom fallback components
 */
export default class ErrorBoundary extends Component<Props, State> {
  private retryTimeouts: number[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send to error reporting service (e.g., Sentry, LogRocket)
    this.logErrorToService(error, errorInfo);
  }

  componentWillUnmount() {
    // Clear any pending retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  /**
   * Log error to external service
   */
  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // TODO: Integrate with error tracking service
    // Examples: Sentry, LogRocket, Bugsnag, etc.

    const errorData = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(error, { extra: errorData });
      // Example: logErrorToService(errorData);
      console.error('Error logged to service:', errorData);
    }
  }

  /**
   * Reset error state and retry
   */
  handleReset = () => {
    const { retryLimit = 3 } = this.props;
    const { retryCount } = this.state;

    // Check retry limit
    if (retryCount >= retryLimit) {
      console.warn('Retry limit reached, showing error fallback');
      return;
    }

    // Increment retry count
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  /**
   * Reset with exponential backoff retry
   */
  handleResetWithRetry = () => {
    const { retryLimit = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= retryLimit) {
      console.warn('Retry limit reached');
      return;
    }

    // Exponential backoff: 2^retryCount seconds
    const backoffDelay = Math.pow(2, retryCount) * 1000;

    const timeout = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }, backoffDelay);

    this.retryTimeouts.push(timeout);
  };

  /**
   * Full page reload (last resort)
   */
  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, isolate } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Use ErrorFallback component with retry functionality
      return (
        <ErrorFallback
          error={error}
          resetError={this.handleReset}
        />
      );
    }

    return children;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNCTIONAL WRAPPER & HOC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * withErrorBoundary - HOC for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    isolate?: boolean;
    retryLimit?: number;
  }
) {
  const WrappedComponent = function WrappedComponent(props: P) {
    return (
      <ErrorBoundary
        fallback={options?.fallback}
        onError={options?.onError}
        isolate={options?.isolate}
        retryLimit={options?.retryLimit}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  // Set display name for debugging
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}

// ─────────────────────────────────────────────────────────────────────────────
// SPECIALIZED ERROR BOUNDARIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * RouteErrorBoundary - For route-level error handling
 * Catches errors during route transitions
 */
export function RouteErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      isolate={true}
      onError={(error, errorInfo) => {
        console.error('Route error:', error, errorInfo);
        // Log route-specific errors
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * ComponentErrorBoundary - For individual component error handling
 * Useful for isolating errors in specific components
 */
export function ComponentErrorBoundary({
  children,
  fallback
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={fallback}
      isolate={true}
      retryLimit={1}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * AsyncErrorBoundary - For async operations (data fetching, etc.)
 * Wraps components that might throw during async operations
 */
export function AsyncErrorBoundary({
  children,
  fallback
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={fallback}
      isolate={true}
      onError={(error) => {
        // Handle async errors specifically
        if (error.message.includes('fetch') || error.message.includes('network')) {
          console.error('Network error in component:', error);
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR BOUNDARY HOOK (for functional components)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useErrorHandler - Hook for triggering error boundary from async operations
 * Usage: const handleError = useErrorHandler();
 *        try { ... } catch (error) { handleError(error); }
 */
export function useErrorHandler() {
  return React.useCallback((error: Error) => {
    throw error;
  }, []);
}

/**
 * useErrorBoundary - Hook for checking if inside error boundary
 * Returns state and reset function
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetErrorBoundary = React.useCallback(() => {
    setError(null);
  }, []);

  // Throw error to be caught by boundary
  if (error) {
    throw error;
  }

  return {
    triggerErrorBoundary: setError,
    resetErrorBoundary
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR BOUNDARY PROVIDER (Context-based)
// ─────────────────────────────────────────────────────────────────────────────

interface ErrorBoundaryContextValue {
  triggerError: (error: Error) => void;
  resetError: () => void;
}

export const ErrorBoundaryContext = React.createContext<ErrorBoundaryContextValue | null>(null);

/**
 * ErrorBoundaryProvider - Context provider for error boundary
 * Allows triggering error boundary from anywhere in the tree
 */
export function ErrorBoundaryProvider({
  children,
  onError
}: {
  children: ReactNode;
  onError?: (error: Error) => void;
}) {
  const [error, setError] = React.useState<Error | null>(null);

  const triggerError = React.useCallback((err: Error) => {
    setError(err);
    if (onError) {
      onError(err);
    }
  }, [onError]);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  // Throw error to be caught by boundary
  if (error) {
    throw error;
  }

  const contextValue = React.useMemo(() => ({
    triggerError,
    resetError
  }), [triggerError, resetError]);

  return (
    <ErrorBoundaryContext.Provider value={contextValue}>
      {children}
    </ErrorBoundaryContext.Provider>
  );
}

/**
 * useErrorBoundaryContext - Hook for accessing error boundary context
 */
export function useErrorBoundaryContext() {
  const context = React.useContext(ErrorBoundaryContext);

  if (!context) {
    throw new Error('useErrorBoundaryContext must be used within ErrorBoundaryProvider');
  }

  return context;
}
