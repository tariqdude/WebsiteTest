import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Clock,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
  Database,
  Monitor,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react';
import { useSSRSafeSimple } from '../../../lib/hooks/useSSRSafeSimple.js';

const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    domNodes: 0,
    memoryUsage: { used: 0, total: 0 },
    connectionType: 'unknown',
    renderTime: 0,
    bundleSize: 0,
    cacheEfficiency: 0,
    fps: 0,
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [history, setHistory] = useState([]);
  const fpsRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  const { isReady, deviceInfo, safeExecute, safeInterval, safeTimeout } =
    useSSRSafeSimple();

  // Enhanced FPS tracking with requestAnimationFrame
  const trackFPS = useCallback(() => {
    const measure = () => {
      frameCountRef.current++;
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      if (delta >= 1000) {
        fpsRef.current = Math.round((frameCountRef.current * 1000) / delta);
        frameCountRef.current = 0;
        lastTimeRef.current = now;

        setMetrics((prev) => ({ ...prev, fps: fpsRef.current }));
      }

      if (isMonitoring) {
        requestAnimationFrame(measure);
      }
    };

    if (isMonitoring) {
      requestAnimationFrame(measure);
    }
  }, [isMonitoring]);

  // Comprehensive performance analysis
  const analyzePerformance = useCallback(async () => {
    if (!isReady) return;

    const startTime = performance.now();

    try {
      // Navigation Timing API
      const navigation = performance.getEntriesByType('navigation')[0];
      const loadTime = navigation
        ? Math.round(navigation.loadEventEnd - navigation.fetchStart)
        : 0;

      // DOM Analysis
      const domNodes = document.querySelectorAll('*').length;

      // Memory API (Chrome only)
      const memory = performance.memory || {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
      };
      const memoryUsage = {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
      };

      // Network Information API
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
      const connectionType = connection
        ? connection.effectiveType || connection.type
        : 'unknown';

      // Render time calculation
      const renderTime = Math.round(performance.now() - startTime);

      // Resource Timing for bundle size estimation
      const resources = performance.getEntriesByType('resource');
      const bundleSize = Math.round(
        resources
          .filter(
            (resource) =>
              resource.name.includes('.js') || resource.name.includes('.css')
          )
          .reduce(
            (total, resource) => total + (resource.transferSize || 0),
            0
          ) / 1024
      );

      // Cache efficiency analysis
      const cachedResources = resources.filter(
        (resource) =>
          resource.transferSize === 0 && resource.decodedBodySize > 0
      ).length;
      const cacheEfficiency =
        resources.length > 0
          ? Math.round((cachedResources / resources.length) * 100)
          : 0;

      const newMetrics = {
        loadTime,
        domNodes,
        memoryUsage,
        connectionType,
        renderTime,
        bundleSize,
        cacheEfficiency,
        fps: fpsRef.current,
      };

      setMetrics(newMetrics);

      // Add to history for trend analysis
      setHistory((prev) =>
        [
          ...prev,
          {
            timestamp: Date.now(),
            ...newMetrics,
          },
        ].slice(-20)
      ); // Keep last 20 measurements
    } catch (error) {
      console.warn('Performance analysis error:', error);
    }
  }, [isReady]);

  // Start monitoring
  useEffect(() => {
    if (isReady) {
      analyzePerformance();
    }
  }, [isReady, analyzePerformance]);

  // FPS monitoring effect
  useEffect(() => {
    trackFPS();
  }, [trackFPS]);

  // Auto-refresh when monitoring
  useEffect(() => {
    if (!isMonitoring || !isReady) return;

    const interval = safeInterval(() => {
      analyzePerformance();
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring, isReady, analyzePerformance, safeInterval]);

  // Performance status calculation
  const performanceStatus = useMemo(() => {
    const scores = {
      loadTime:
        metrics.loadTime < 3000
          ? 'good'
          : metrics.loadTime < 5000
            ? 'fair'
            : 'poor',
      domNodes:
        metrics.domNodes < 1500
          ? 'good'
          : metrics.domNodes < 3000
            ? 'fair'
            : 'poor',
      memory:
        metrics.memoryUsage.used < 50
          ? 'good'
          : metrics.memoryUsage.used < 100
            ? 'fair'
            : 'poor',
      fps: metrics.fps >= 50 ? 'good' : metrics.fps >= 30 ? 'fair' : 'poor',
      cache:
        metrics.cacheEfficiency > 70
          ? 'good'
          : metrics.cacheEfficiency > 40
            ? 'fair'
            : 'poor',
    };

    const goodCount = Object.values(scores).filter(
      (score) => score === 'good'
    ).length;
    const totalCount = Object.values(scores).length;

    return {
      overall:
        goodCount >= totalCount * 0.8
          ? 'excellent'
          : goodCount >= totalCount * 0.6
            ? 'good'
            : goodCount >= totalCount * 0.4
              ? 'fair'
              : 'poor',
      scores,
    };
  }, [metrics]);

  // Trend analysis for history
  const trends = useMemo(() => {
    if (history.length < 2) return {};

    const latest = history[history.length - 1];
    const previous = history[history.length - 2];

    return {
      loadTime: latest.loadTime - previous.loadTime,
      domNodes: latest.domNodes - previous.domNodes,
      memory: latest.memoryUsage.used - previous.memoryUsage.used,
      fps: latest.fps - previous.fps,
    };
  }, [history]);

  // Metric card component
  const MetricCard = ({
    icon: Icon,
    title,
    value,
    unit,
    status,
    trend,
    description,
  }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'good':
        case 'excellent':
          return 'text-green-600 dark:text-green-400';
        case 'fair':
          return 'text-yellow-600 dark:text-yellow-400';
        case 'poor':
          return 'text-red-600 dark:text-red-400';
        default:
          return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'good':
        case 'excellent':
          return <CheckCircle className='h-4 w-4' />;
        case 'fair':
          return <Info className='h-4 w-4' />;
        case 'poor':
          return <AlertCircle className='h-4 w-4' />;
        default:
          return <Activity className='h-4 w-4' />;
      }
    };

    const getTrendIcon = (trend) => {
      if (!trend) return null;
      return trend > 0 ? '↗️' : trend < 0 ? '↘️' : '➡️';
    };

    return (
      <motion.div
        layout
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
      >
        <div className='mb-2 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Icon className='h-5 w-5 text-blue-500' />
            <span className='font-medium text-gray-900 dark:text-white'>
              {title}
            </span>
          </div>
          <div className={`flex items-center gap-1 ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            {trend !== undefined && (
              <span className='ml-1 text-xs'>{getTrendIcon(trend)}</span>
            )}
          </div>
        </div>

        <div className='mb-2'>`
          <span className={`text-2xl font-bold ${getStatusColor(status)}`}>
            {typeof value === 'object'`
              ? `${value.used}/${value.total}`
              : value.toLocaleString()}
          </span>
          {unit && (
            <span className='ml-1 text-sm text-gray-500 dark:text-gray-400'>
              {unit}
            </span>
          )}
        </div>

        {description && (
          <p className='text-xs text-gray-600 dark:text-gray-400'>
            {description}
          </p>
        )}
      </motion.div>
    );
  };

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
        <div className='mb-8 text-center'>
          <div`
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-lg font-bold ${
              performanceStatus.overall === 'excellent'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : performanceStatus.overall === 'good'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : performanceStatus.overall === 'fair'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'`
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
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMonitoring((prev) => !prev)}`
            className={`flex items-center gap-2 rounded-xl px-6 py-3 font-bold shadow-lg transition-colors ${
              isMonitoring
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'`
            }`}
          >
            <Monitor className='h-5 w-5' />
            {isMonitoring ? 'Stop' : 'Start'} Live Monitoring
          </motion.button>
        </div>

        {/* Metrics Grid */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <MetricCard
            icon={Clock}
            title='Load Time'
            value={metrics.loadTime}
            unit='ms'
            status={performanceStatus.scores.loadTime}
            trend={trends.loadTime}
            description='Total page load duration'
          />

          <MetricCard
            icon={HardDrive}
            title='DOM Nodes'
            value={metrics.domNodes}
            status={performanceStatus.scores.domNodes}
            trend={trends.domNodes}
            description='Total DOM elements'
          />

          <MetricCard
            icon={Cpu}
            title='Memory Usage'
            value={metrics.memoryUsage}
            unit='MB'
            status={performanceStatus.scores.memory}
            trend={trends.memory}
            description='JavaScript heap memory'
          />

          <MetricCard
            icon={Wifi}
            title='Connection'
            value={metrics.connectionType}
            status='good'
            description='Network connection type'
          />

          <MetricCard
            icon={Zap}
            title='Render Time'
            value={metrics.renderTime}
            unit='ms'
            status='good'
            description='Component render duration'
          />

          <MetricCard
            icon={Database}
            title='Bundle Size'
            value={metrics.bundleSize}
            unit='KB'
            status='good'
            description='JavaScript/CSS bundle size'
          />

          <MetricCard
            icon={TrendingUp}
            title='Cache Efficiency'
            value={metrics.cacheEfficiency}
            unit='%'
            status={performanceStatus.scores.cache}
            description='Resource cache hit rate'
          />

          <MetricCard
            icon={Activity}
            title='Live FPS'
            value={metrics.fps}
            unit='fps'
            status={performanceStatus.scores.fps}
            trend={trends.fps}
            description='Current frame rate'
          />
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
};

export default PerformanceMetrics;
`