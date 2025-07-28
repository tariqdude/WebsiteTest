import { useState, useEffect } from 'react';
import { Activity, Zap, Globe, Clock } from 'lucide-react';
import { useSSRSafe } from '../../lib/hooks/useSSRSafe.js';

const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    domNodes: 0,
    memoryUsage: 0,
    connectionType: 'unknown',
  });
  const [isLoading, setIsLoading] = useState(true);

  const {
    isMounted,
    isClient,
    safePerformanceAccess,
    safeDocumentAccess,
    safeNavigatorAccess,
    addEventListener,
  } = useSSRSafe();

  useEffect(() => {
    if (!isClient) return;

    const calculateMetrics = () => {
      try {
        // SSR-safe timing metrics
        const loadTime =
          typeof performance !== 'undefined'
            ? safePerformanceAccess((perf) => {
                const navigation = perf.getEntriesByType('navigation')[0];
                return navigation
                  ? Math.round(
                      navigation.loadEventEnd - navigation.loadEventStart
                    )
                  : 0;
              }, 0)
            : 0;

        // SSR-safe DOM nodes count
        const domNodes =
          typeof document !== 'undefined'
            ? safeDocumentAccess((doc) => {
                return doc.getElementsByTagName('*').length;
              }, 0)
            : 0;

        // SSR-safe memory usage
        const memoryUsage =
          typeof performance !== 'undefined'
            ? safePerformanceAccess((perf) => {
                return perf.memory
                  ? Math.round(perf.memory.usedJSHeapSize / 1048576)
                  : 0;
              }, 0)
            : 0;

        // SSR-safe connection info
        const connectionType =
          typeof navigator !== 'undefined'
            ? safeNavigatorAccess((nav) => {
                const connection =
                  nav.connection || nav.mozConnection || nav.webkitConnection;
                return connection
                  ? connection.effectiveType || 'unknown'
                  : 'unknown';
              }, 'unknown')
            : 'unknown';

        setMetrics({
          loadTime,
          domNodes,
          memoryUsage,
          connectionType,
        });
        setIsLoading(false);
      } catch (error) {
        console.warn('Error calculating performance metrics:', error);
        setIsLoading(false);
      }
    };

    // SSR-safe event listeners
    const setupMetrics = () => {
      if (safeDocumentAccess((doc) => doc.readyState === 'complete', false)) {
        calculateMetrics();
      } else {
        const cleanup = addEventListener('load', calculateMetrics);
        return cleanup;
      }
    };

    const cleanup = setupMetrics();
    return cleanup;
  }, [isClient]);

  // Don't render during SSR
  if (!isMounted) {
    return (
      <div className='flex min-h-[200px] items-center justify-center rounded-lg bg-white p-6 shadow-md dark:bg-gray-800'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-gray-600 dark:text-gray-400'>
            Loading Performance Metrics...
          </p>
        </div>
      </div>
    );
  }

  const metricsData = [
    {
      icon: Clock,
      label: 'Load Time',
      value: isLoading ? '...' : `${metrics.loadTime}ms`,
      color: 'text-blue-400',
    },
    {
      icon: Activity,
      label: 'DOM Nodes',
      value: isLoading ? '...' : metrics.domNodes.toLocaleString(),
      color: 'text-green-400',
    },
    {
      icon: Zap,
      label: 'Memory Usage',
      value: isLoading ? '...' : `${metrics.memoryUsage}MB`,
      color: 'text-yellow-400',
    },
    {
      icon: Globe,
      label: 'Connection',
      value: isLoading ? '...' : metrics.connectionType.toUpperCase(),
      color: 'text-purple-400',
    },
  ];

  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
      {metricsData.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={metric.label}
            className='rounded-lg border border-gray-700/50 bg-gray-900/50 p-4 backdrop-blur-sm'
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className='mb-2 flex items-center space-x-2'>
              <IconComponent className={`h-5 w-5 ${metric.color}`} />
              <span className='text-sm font-medium text-gray-400'>
                {metric.label}
              </span>
            </div>
            <div className={`text-2xl font-bold ${metric.color}`}>
              {isLoading ? (
                <div className='h-8 w-16 animate-pulse rounded bg-gray-700'></div>
              ) : (
                metric.value
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PerformanceMetrics;
