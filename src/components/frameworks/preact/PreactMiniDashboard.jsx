// Preact Lightweight Component
import { useState, useEffect } from 'preact/hooks';

const PreactMiniDashboard = () => {
  const [metrics, setMetrics] = useState({
    users: 0,
    sales: 0,
    orders: 0,
    revenue: 0
  });
  
  const [isAnimating, setIsAnimating] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        users: prev.users + Math.floor(Math.random() * 5),
        sales: prev.sales + Math.floor(Math.random() * 100),
        orders: prev.orders + Math.floor(Math.random() * 3),
        revenue: prev.revenue + Math.floor(Math.random() * 1000)
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
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Sales',
      value: metrics.sales,
      icon: '💰',
      color: 'from-green-400 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Orders',
      value: metrics.orders,
      icon: '📦',
      color: 'from-purple-400 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Revenue ($)',
      value: metrics.revenue,
      icon: '📈',
      color: 'from-orange-400 to-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            Preact Mini Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Lightweight & fast • Only 3KB runtime
          </p>
        </div>
        <button
          onClick={resetMetrics}
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 text-sm font-medium"
        >
          Reset Data
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricCards.map((card, index) => (
          <div
            key={card.title}
            className={`${card.bgColor} dark:bg-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 ${
              isAnimating ? 'animate-pulse' : ''
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">{card.icon}</div>
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${card.color} animate-pulse`}></div>
            </div>
            
            <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {formatNumber(card.value)}
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {card.title}
            </div>
            
            {/* Mini progress bar */}
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full bg-gradient-to-r ${card.color} transition-all duration-1000`}
                style={{ width: `${Math.min((card.value % 100), 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Activity Feed */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Live Activity
        </h4>
        
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {metrics.users > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
              <span className="text-blue-500 mr-2">•</span>
              New user joined ({formatNumber(metrics.users)} total)
            </div>
          )}
          {metrics.sales > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
              <span className="text-green-500 mr-2">•</span>
              Sales updated: ${formatNumber(metrics.sales)}
            </div>
          )}
          {metrics.orders > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
              <span className="text-purple-500 mr-2">•</span>
              {formatNumber(metrics.orders)} orders processed
            </div>
          )}
          {metrics.revenue > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
              <span className="text-orange-500 mr-2">•</span>
              Revenue: ${formatNumber(metrics.revenue)}
            </div>
          )}
        </div>
      </div>

      {/* Performance Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">3KB</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Runtime Size</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">Fast</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Render Speed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">React API</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Compatible</div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Preact: Fast 3kB alternative to React with the same modern API
        </p>
      </div>
    </div>
  );
};

export default PreactMiniDashboard;
