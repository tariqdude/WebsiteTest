// Preact Lightweight Component
import { useState, useEffect } from 'preact/hooks';

const PreactMiniDashboard = () => {
  const [metrics, setMetrics] = useState({
    users: 0,
    sales: 0,
    orders: 0,
    revenue: 0,
  });

  const [isAnimating, setIsAnimating] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        users: prev.users + Math.floor(Math.random() * 5),
        sales: prev.sales + Math.floor(Math.random() * 100),
        orders: prev.orders + Math.floor(Math.random() * 3),
        revenue: prev.revenue + Math.floor(Math.random() * 1000),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const resetMetrics = () => {
    setIsAnimating(true);
    setMetrics({ users: 0, sales: 0, orders: 0, revenue: 0 });
    setTimeout(() => setIsAnimating(false), 500);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const metricCards = [
    {
      title: 'Active Users',
      value: metrics.users,
      icon: '👥',
      color: 'from-blue-400 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Sales',
      value: metrics.sales,
      icon: '💰',
      color: 'from-green-400 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Orders',
      value: metrics.orders,
      icon: '📦',
      color: 'from-purple-400 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Revenue ($)',
      value: metrics.revenue,
      icon: '📈',
      color: 'from-orange-400 to-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className='w-full rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h3 className='text-2xl font-bold text-gray-800 dark:text-white'>
            Preact Mini Dashboard
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-300'>
            Lightweight & fast • Only 3KB runtime
          </p>
        </div>
        <button
          onClick={resetMetrics}
          className='transform rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-pink-600'
        >
          Reset Data
        </button>
      </div>

      {/* Metrics Grid */}
      <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {metricCards.map((card, index) => (
          <div
            key={card.title}
            className={`${card.bgColor} rounded-lg p-4 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-700 ${isAnimating ? 'animate-pulse' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className='mb-3 flex items-center justify-between'>
              <div className='text-2xl'>{card.icon}</div>
              <div
                className={`h-3 w-3 rounded-full bg-gradient-to-r ${card.color} animate-pulse`}
              ></div>
            </div>

            <div className='mb-1 text-2xl font-bold text-gray-800 dark:text-white'>
              {formatNumber(card.value)}
            </div>

            <div className='text-sm text-gray-600 dark:text-gray-400'>
              {card.title}
            </div>

            {/* Mini progress bar */}
            <div className='mt-2 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-600'>
              <div
                className={`h-1.5 rounded-full bg-gradient-to-r ${card.color} transition-all duration-1000`}
                style={{ width: `${Math.min(card.value % 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Activity Feed */}
      <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
        <h4 className='mb-3 flex items-center font-semibold text-gray-800 dark:text-white'>
          <span className='mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500'></span>
          Live Activity
        </h4>

        <div className='max-h-32 space-y-2 overflow-y-auto'>
          {metrics.users > 0 && (
            <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
              <span className='mr-2 text-blue-500'>•</span>
              New user joined ({formatNumber(metrics.users)} total)
            </div>
          )}
          {metrics.sales > 0 && (
            <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
              <span className='mr-2 text-green-500'>•</span>
              Sales updated: ${formatNumber(metrics.sales)}
            </div>
          )}
          {metrics.orders > 0 && (
            <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
              <span className='mr-2 text-purple-500'>•</span>
              {formatNumber(metrics.orders)} orders processed
            </div>
          )}
          {metrics.revenue > 0 && (
            <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
              <span className='mr-2 text-orange-500'>•</span>
              Revenue: ${formatNumber(metrics.revenue)}
            </div>
          )}
        </div>
      </div>

      {/* Performance Stats */}
      <div className='mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 pt-4 dark:border-gray-600'>
        <div className='text-center'>
          <div className='text-lg font-bold text-blue-600'>3KB</div>
          <div className='text-xs text-gray-600 dark:text-gray-400'>
            Runtime Size
          </div>
        </div>
        <div className='text-center'>
          <div className='text-lg font-bold text-green-600'>Fast</div>
          <div className='text-xs text-gray-600 dark:text-gray-400'>
            Render Speed
          </div>
        </div>
        <div className='text-center'>
          <div className='text-lg font-bold text-purple-600'>React API</div>
          <div className='text-xs text-gray-600 dark:text-gray-400'>
            Compatible
          </div>
        </div>
      </div>

      <div className='mt-4 text-center'>
        <p className='text-xs text-gray-500 dark:text-gray-400'>
          Preact: Fast 3kB alternative to React with the same modern API
        </p>
      </div>
    </div>
  );
};

export default PreactMiniDashboard;