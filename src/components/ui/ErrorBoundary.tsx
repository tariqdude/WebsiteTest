import { Component } from 'react';
import type { ErrorInfo, ReactNode, ComponentType } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🔴 React Error Boundary caught an error:', error);
      console.error('Component stack trace:', errorInfo.componentStack);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      const canRetry = this.state.retryCount < this.maxRetries;
      const isDev = process.env.NODE_ENV === 'development';

      return (
        <div className='error-boundary m-4 rounded-lg border-2 border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20'>
          <div className='mb-4 flex items-center'>
            <div className='mr-3 text-2xl text-red-500'>⚠️</div>
            <h2 className='text-lg font-bold text-red-800 dark:text-red-200'>
              Component Error
            </h2>
          </div>

          <p className='mb-4 text-red-700 dark:text-red-300'>
            Something went wrong with this component.{' '}
            {canRetry && 'You can try again.'}
          </p>

          <div className='mb-4 flex gap-3'>
            {canRetry && (
              <button
                onClick={this.handleRetry}
                className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              >
                Retry ({this.maxRetries - this.state.retryCount} attempts left)
              </button>
            )}

            <button
              onClick={() => window.location.reload()}
              className='rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
            >
              Reload Page
            </button>
          </div>

          {(isDev || this.props.showDetails) && this.state.error && (
            <details className='mt-4'>
              <summary className='cursor-pointer font-medium text-red-800 dark:text-red-200'>
                Error Details (Development)
              </summary>
              <div className='mt-2 rounded border-l-4 border-red-500 bg-red-100 p-3 dark:bg-red-900/40'>
                <pre className='whitespace-pre-wrap text-sm text-red-900 dark:text-red-100'>
                  <strong>Error:</strong> {this.state.error.message}
                  {'\n\n'}
                  <strong>Stack:</strong> {this.state.error.stack}
                  {this.state.errorInfo && (
                    <>
                      {'\n\n'}
                      <strong>Component Stack:</strong>{' '}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping
export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Hook for error reporting
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('🔴 Error caught by useErrorHandler:', error);
    if (errorInfo) {
      console.error('Component stack:', errorInfo.componentStack);
    }
  };
}
