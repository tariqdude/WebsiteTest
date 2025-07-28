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

  useEffect(() => {
    const calculateMetrics = () => {
      // Performance metrics
      const navigation = performance.getEntriesByType('navigation')[0];
      const loadTime = navigation
        ? Math.round(navigation.loadEventEnd - navigation.loadEventStart)
        : 0;

      // DOM nodes count
      const domNodes = document.getElementsByTagName('*').length;

      // Memory usage (if available)
      const memoryUsage = performance.memory
        ? Math.round(performance.memory.usedJSHeapSize / 1048576)
        : 0;

      // Connection info
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
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
    };

    // Wait for page load
    if (document.readyState === 'complete') {
      calculateMetrics();
    } else {
      window.addEventListener('load', calculateMetrics);
    }

    return () => {
      window.removeEventListener('load', calculateMetrics);
    };
  }, []);

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
