import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Activity,
  Zap,
  Globe,
  Clock,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
} from 'lucide-react';
import { useSSRSafeSimple } from '../../lib/hooks/useSSRSafeSimple.js';

const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    domNodes: 0,
    memoryUsage: 0,
    connectionType: 'unknown',
    renderTime: 0,
    bundleSize: 0,
    cacheEfficiency: 0,
    interactionLatency: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [liveMetrics, setLiveMetrics] = useState({
    fps: 0,
    cpuUsage: 0,
    networkLatency: 0,
  });

  const {
    isMounted,
    isClient,
    isReady,
    deviceInfo,
    safeExecute,
    safeInterval,
    safeTimeout,
  } = useSSRSafeSimple();

  // Enhanced metrics calculation with comprehensive performance data
  const calculateMetrics = useCallback(() => {
    return safeExecute(
      () => {
        const startTime = performance.now();

        // Navigation Timing API - Enhanced
        const navEntry = performance.getEntriesByType('navigation')[0];
        const loadTime = navEntry
          ? Math.round(navEntry.loadEventEnd - navEntry.loadEventStart)
          : 0;

        const renderTime = navEntry
          ? Math.round(
              navEntry.domContentLoadedEventEnd -
                navEntry.domContentLoadedEventStart
            )
          : 0;

        // Resource Timing - Calculate bundle efficiency
        const resources = performance.getEntriesByType('resource');
        const totalSize = resources.reduce((total, resource) => {
          return total + (resource.transferSize || 0);
        }, 0);
        const bundleSize = Math.round(totalSize / 1024); // KB

        // Cache efficiency calculation
        const cachedResources = resources.filter(
          (r) => r.transferSize === 0
        ).length;
        const cacheEfficiency =
          resources.length > 0
            ? Math.round((cachedResources / resources.length) * 100)
            : 0;

        // DOM complexity analysis
        const domNodes = document.getElementsByTagName('*').length;

        // Memory usage with heap analysis
        const memoryInfo = performance.memory || {};
        const memoryUsage = Math.round(
          (memoryInfo.usedJSHeapSize || 0) / 1048576
        );

        // Network connection quality
        const connection =
          navigator.connection ||
          navigator.mozConnection ||
          navigator.webkitConnection;
        const connectionType = connection?.effectiveType || 'unknown';

        // Interaction responsiveness
        const interactionEntries = performance.getEntriesByType('first-input');
        const interactionLatency =
          interactionEntries.length > 0
            ? Math.round(
                interactionEntries[0].processingStart -
                  interactionEntries[0].startTime
              )
            : 0;

        const calculationTime = performance.now() - startTime;

        return {
          loadTime,
          domNodes,
          memoryUsage,
          connectionType,
          renderTime,
          bundleSize,
          cacheEfficiency,
          interactionLatency,
          calculationTime: Math.round(calculationTime),
        };
      },
      {
        loadTime: 0,
        domNodes: 0,
        memoryUsage: 0,
        connectionType: 'unknown',
        renderTime: 0,
        bundleSize: 0,
        cacheEfficiency: 0,
        interactionLatency: 0,
        calculationTime: 0,
      }
    );
  }, [safeExecute]);

  // Live performance monitoring
  const startLiveMonitoring = useCallback(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      const now = performance.now();
      frameCount++;

      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        frameCount = 0;
        lastTime = now;

        setLiveMetrics((prev) => ({ ...prev, fps }));
      }

      if (isReady) {
        requestAnimationFrame(measureFPS);
      }
    };

    if (isReady) {
      requestAnimationFrame(measureFPS);

      // Network latency monitoring
      const measureNetworkLatency = () => {
        const start = performance.now();
        fetch('data:text/plain,test', { method: 'HEAD' })
          .then(() => {
            const latency = Math.round(performance.now() - start);
            setLiveMetrics((prev) => ({ ...prev, networkLatency: latency }));
          })
          .catch(() => {
            setLiveMetrics((prev) => ({ ...prev, networkLatency: -1 }));
          });
      };

      // Measure network latency every 5 seconds
      const networkTimer = safeInterval(measureNetworkLatency, 5000);
      measureNetworkLatency(); // Initial measurement

      return () => {
        clearInterval(networkTimer);
      };
    }
  }, [isReady, safeInterval]);

  // Initialize metrics
  useEffect(() => {
    if (!isReady) return;

    const initTimer = safeTimeout(() => {
      const results = calculateMetrics();
      setMetrics(results);
      setIsLoading(false);

      // Start live monitoring
      startLiveMonitoring();
    }, 100);

    return () => clearTimeout(initTimer);
  }, [isReady, calculateMetrics, startLiveMonitoring, safeTimeout]);

  // Enhanced metrics data with comprehensive information
  const metricsData = useMemo(
    () => [
      {
        icon: Clock,
        label: 'Load Time',
        value: isLoading ? '...' : `${metrics.loadTime}ms`,
        color: 'text-blue-400',
        description: 'Total page load duration',
        status:
          metrics.loadTime < 1000
            ? 'excellent'
            : metrics.loadTime < 3000
              ? 'good'
              : 'poor',
      },
      {
        icon: Activity,
        label: 'DOM Nodes',
        value: isLoading ? '...' : metrics.domNodes.toLocaleString(),
        color: 'text-green-400',
        description: 'Total DOM elements',
        status:
          metrics.domNodes < 1000
            ? 'excellent'
            : metrics.domNodes < 5000
              ? 'good'
              : 'heavy',
      },
      {
        icon: HardDrive,`
        label: 'Memory',``
        value: isLoading ? '...' : `${metrics.memoryUsage}MB`,
        color: 'text-purple-400',
        description: 'JavaScript heap usage',
        status:
          metrics.memoryUsage < 50
            ? 'excellent'
            : metrics.memoryUsage < 100
              ? 'good'
              : 'high',
      },
      {
        icon: Wifi,
        label: 'Connection',
        value: isLoading ? '...' : metrics.connectionType,
        color: 'text-orange-400',
        description: 'Network connection type',
        status: ['4g', '5g'].includes(metrics.connectionType)
          ? 'excellent'
          : 'standard',
      },
      {
        icon: Zap,`
        label: 'Render Time',``
        value: isLoading ? '...' : `${metrics.renderTime}ms`,
        color: 'text-yellow-400',
        description: 'DOM content loaded time',
        status:
          metrics.renderTime < 500
            ? 'excellent'
            : metrics.renderTime < 1500
              ? 'good'
              : 'slow',
      },
      {
        icon: Globe,`
        label: 'Bundle Size',``
        value: isLoading ? '...' : `${metrics.bundleSize}KB`,
        color: 'text-indigo-400',
        description: 'Total resource size',
        status:
          metrics.bundleSize < 500
            ? 'excellent'
            : metrics.bundleSize < 1000
              ? 'good'
              : 'large',
      },
      {
        icon: Monitor,`
        label: 'Cache Hit',``
        value: isLoading ? '...' : `${metrics.cacheEfficiency}%`,
        color: 'text-teal-400',
        description: 'Resource cache efficiency',
        status:
          metrics.cacheEfficiency > 70
            ? 'excellent'
            : metrics.cacheEfficiency > 40
              ? 'good'
              : 'poor',
      },
      {
        icon: Cpu,`
        label: 'Live FPS',``
        value: liveMetrics.fps > 0 ? `${liveMetrics.fps}fps` : '...',
        color: 'text-red-400',
        description: 'Current frame rate',
        status:
          liveMetrics.fps > 50
            ? 'excellent'
            : liveMetrics.fps > 30
              ? 'good'
              : 'low',
      },
    ],
    [metrics, liveMetrics, isLoading]
  );

  // Enhanced status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500/20 border-green-500/30';
      case 'good':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'poor':
      case 'slow':
      case 'high':
      case 'large':
      case 'low':
        return 'bg-red-500/20 border-red-500/30';
      default:
        return 'bg-gray-500/20 border-gray-500/30';
    }
  };

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

  

  return (
    <div className='mx-auto w-full max-w-6xl p-6'>
      <div className='rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-8 shadow-xl dark:border-gray-700 dark:from-gray-800 dark:to-gray-900'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h2 className='mb-2 text-3xl font-bold text-gray-900 dark:text-white'>
            📊 Advanced Performance Analytics
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Real-time monitoring with{' '}
            {deviceInfo.isMobile ? 'mobile' : 'desktop'} optimization
          </p>
        </div>

        {/* Overall Status */}
        <div className='mb-8 text-center'>`
          <div``
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-lg font-bold ${
              performanceStatus.overall === 'excellent'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : performanceStatus.overall === 'good'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : performanceStatus.overall === 'fair'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'`
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'``
            }`}
          >
            <Activity className='h-6 w-6' />
            Performance: {performanceStatus.overall.toUpperCase()}
          </div>
        </div>

        {/* Control Buttons */}
        <div className='mb-8 flex justify-center gap-4'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={analyzePerformance}
            className='flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-bold text-white shadow-lg transition-colors hover:bg-blue-600'
          >
            <Zap className='h-5 w-5' />
            Analyze Now
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}`
            onClick={() => setIsMonitoring((prev) => !prev)}``
            className={`flex items-center gap-2 rounded-xl px-6 py-3 font-bold shadow-lg transition-colors ${
              isMonitoring
                ? 'bg-red-500 text-white hover:bg-red-600'`
                : 'bg-green-500 text-white hover:bg-green-600'``
            }`}
          >
            <Monitor className='h-5 w-5' />
            {isMonitoring ? 'Stop' : 'Start'} Live Monitoring
          </motion.button>
        </div>

        {/* Metrics Grid */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {metricsData.map((metric, index) => (
            <MetricCard
              key={metric.label}
              icon={metric.icon}
              title={metric.label}
              value={metric.value}
              unit={metric.unit}
              status={metric.status}
              trend={metric.trend}
              description={metric.description}
            />
          ))}
        </div>

        {/* Performance History */}
        {history.length > 0 && (
          <div className='rounded-xl bg-gray-50 p-6 dark:bg-gray-800'>
            <h3 className='mb-4 flex items-center gap-2 font-bold text-gray-900 dark:text-white'>
              <TrendingUp className='h-5 w-5' />
              Performance History ({history.length} measurements)
            </h3>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <div className='rounded-lg bg-white p-3 dark:bg-gray-700'>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Avg Load Time
                </div>
                <div className='text-lg font-bold text-gray-900 dark:text-white'>
                  {Math.round(
                    history.reduce((sum, h) => sum + h.loadTime, 0) /
                      history.length
                  )}
                  ms
                </div>
              </div>

              <div className='rounded-lg bg-white p-3 dark:bg-gray-700'>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Avg FPS
                </div>
                <div className='text-lg font-bold text-gray-900 dark:text-white'>
                  {Math.round(
                    history.reduce((sum, h) => sum + h.fps, 0) / history.length
                  )}
                </div>
              </div>

              <div className='rounded-lg bg-white p-3 dark:bg-gray-700'>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Peak Memory
                </div>
                <div className='text-lg font-bold text-gray-900 dark:text-white'>
                  {Math.max(...history.map((h) => h.memoryUsage.used))}MB
                </div>
              </div>

              <div className='rounded-lg bg-white p-3 dark:bg-gray-700'>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Best Cache
                </div>
                <div className='text-lg font-bold text-gray-900 dark:text-white'>
                  {Math.max(...history.map((h) => h.cacheEfficiency))}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Device Information */}
        <div className='mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20'>
          <h4 className='mb-2 font-bold text-blue-800 dark:text-blue-200'>
            📱 Device Information
          </h4>
          <div className='grid grid-cols-2 gap-2 text-sm text-blue-700 dark:text-blue-300 md:grid-cols-4'>
            <div>
              Device:{' '}
              {deviceInfo.isMobile
                ? 'Mobile'
                : deviceInfo.isTablet
                  ? 'Tablet'
                  : 'Desktop'}
            </div>
            <div>Touch: {deviceInfo.isTouchDevice ? 'Yes' : 'No'}</div>
            <div>Pixel Ratio: {deviceInfo.pixelRatio}x</div>
            <div>Theme: {deviceInfo.colorScheme}</div>
          </div>
        </div>
      </div>
    </div>
  );
};`
export default PerformanceMetrics;``