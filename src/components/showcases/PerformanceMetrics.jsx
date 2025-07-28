import { useState, useEffect } from 'react';
import { Activity, Zap, Globe, Clock } from 'lucide-react';

const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    domNodes: 0,
    memoryUsage: 0,
    connectionType: 'unknown',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const calculateMetrics = () => {
      try {
        // SSR-safe performance metrics
        const navigation =
          typeof performance !== 'undefined'
            ? performance.getEntriesByType('navigation')[0]
            : null;
        const loadTime = navigation
          ? Math.round(navigation.loadEventEnd - navigation.loadEventStart)
          : 0;

        // SSR-safe DOM nodes count
        const domNodes =
          typeof document !== 'undefined'
            ? document.getElementsByTagName('*').length
            : 0;

        // SSR-safe memory usage
        const memoryUsage =
          typeof performance !== 'undefined' && performance.memory
            ? Math.round(performance.memory.usedJSHeapSize / 1048576)
            : 0;

        // SSR-safe connection info
        const connection =
          typeof navigator !== 'undefined'
            ? navigator.connection ||
              navigator.mozConnection ||
              navigator.webkitConnection
            : null;
        const connectionType = connection
          ? connection.effectiveType || 'unknown'
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
    if (typeof document !== 'undefined') {
      if (document.readyState === 'complete') {
        calculateMetrics();
      } else {
        const handleLoad = () => {
          calculateMetrics();
        };
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    } else {
      // Fallback for SSR
      setIsLoading(false);
    }
  }, [isMounted]);

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
