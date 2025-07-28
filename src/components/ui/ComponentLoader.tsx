import { Suspense, useState, useEffect } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface ComponentLoaderProps {
  component: ComponentType<any>;
  componentProps?: Record<string, any>;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  timeout?: number;
  onError?: (error: Error) => void;
  onLoad?: () => void;
}

const LoadingSkeleton = ({ children }: { children?: ReactNode }) => (
  <div className='animate-pulse'>
    <div className='flex h-32 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700'>
      <div className='text-gray-500 dark:text-gray-400'>
        {children || 'Loading component...'}
      </div>
    </div>
  </div>
);

const TimeoutFallback = () => (
  <div className='rounded-lg border-2 border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20'>
    <div className='mb-2 flex items-center'>
      <div className='mr-2 text-xl text-yellow-500'>⏰</div>
      <h3 className='font-bold text-yellow-800 dark:text-yellow-200'>
        Component Timeout
      </h3>
    </div>
    <p className='text-yellow-700 dark:text-yellow-300'>
      This component is taking longer than expected to load.
    </p>
    <button
      onClick={() => window.location.reload()}
      className='mt-3 rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500'
    >
      Reload Page
    </button>
  </div>
);

export const ComponentLoader = ({
  component: Component,
  componentProps = {},
  loadingFallback,
  errorFallback,
  timeout = 10000,
  onError,
  onLoad,
}: ComponentLoaderProps) => {
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setHasTimedOut(true);
        onError?.(new Error('Component loading timeout'));
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, isLoaded, onError]);

  useEffect(() => {
    if (Component && !isLoaded) {
      setIsLoaded(true);
      onLoad?.();
    }
  }, [Component, isLoaded, onLoad]);

  if (hasTimedOut) {
    return <TimeoutFallback />;
  }

  const fallbackComponent = loadingFallback || <LoadingSkeleton />;
  const errorComponent = errorFallback || undefined;

  return (
    <ErrorBoundary fallback={errorComponent} onError={onError}>
      <Suspense fallback={fallbackComponent}>
        <Component {...componentProps} />
      </Suspense>
    </ErrorBoundary>
  );
};

// Hook for dynamic component loading with error handling
export const useDynamicComponent = (
  importFn: () => Promise<{ default: ComponentType<any> }>
) => {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    importFn()
      .then((module) => {
        if (mounted) {
          setComponent(() => module.default);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [importFn]);

  return { Component, loading, error };
};

// Wrapper for lazy-loaded components
export const LazyComponentWrapper = ({
  importFn,
  fallback,
  ...props
}: {
  importFn: () => Promise<{ default: ComponentType<any> }>;
  fallback?: ReactNode;
  [key: string]: any;
}) => {
  const { Component, loading, error } = useDynamicComponent(importFn);

  if (loading) {
    return fallback || <LoadingSkeleton>Loading component...</LoadingSkeleton>;
  }

  if (error) {
    return (
      <div className='rounded-lg border-2 border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20'>
        <div className='mb-2 flex items-center'>
          <div className='mr-2 text-xl text-red-500'>❌</div>
          <h3 className='font-bold text-red-800 dark:text-red-200'>
            Failed to Load Component
          </h3>
        </div>
        <p className='mb-3 text-red-700 dark:text-red-300'>
          Error: {error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className='rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500'
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (!Component) {
    return <LoadingSkeleton>Component not found...</LoadingSkeleton>;
  }

  return (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
};
