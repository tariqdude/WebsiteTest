import React, { Suspense, useState, useEffect } from 'react';
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
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
      <div className="text-gray-500 dark:text-gray-400">
        {children || 'Loading component...'}
      </div>
    </div>
  </div>
);

const TimeoutFallback = () => (
  <div className="p-6 border-2 border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
    <div className="flex items-center mb-2">
      <div className="text-yellow-500 text-xl mr-2">⏰</div>
      <h3 className="font-bold text-yellow-800 dark:text-yellow-200">Component Timeout</h3>
    </div>
    <p className="text-yellow-700 dark:text-yellow-300">
      This component is taking longer than expected to load.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
    >
      Reload Page
    </button>
  </div>
);

export const ComponentLoader: React.FC<ComponentLoaderProps> = ({
  component: Component,
  componentProps = {},
  loadingFallback,
  errorFallback,
  timeout = 10000,
  onError,
  onLoad
}) => {
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
export const useDynamicComponent = (importFn: () => Promise<{ default: ComponentType<any> }>) => {
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
      <div className="p-6 border-2 border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
        <div className="flex items-center mb-2">
          <div className="text-red-500 text-xl mr-2">❌</div>
          <h3 className="font-bold text-red-800 dark:text-red-200">Failed to Load Component</h3>
        </div>
        <p className="text-red-700 dark:text-red-300 mb-3">
          Error: {error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
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
