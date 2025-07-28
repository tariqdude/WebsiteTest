import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Minus, RotateCcw, Zap } from 'lucide-react';

const InteractiveCounter = () => {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([0]);
  const [showHistory, setShowHistory] = useState(false);
  const [targetValue, setTargetValue] = useState(10);
  const [autoMode, setAutoMode] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [clickCount, setClickCount] = useState(0);
  const [lastActionTime, setLastActionTime] = useState(Date.now());

  const { 
    isReady, 
    deviceInfo, 
    safeExecute, 
    safeInterval,
    safeTimeout
  } = useSSRSafeSimple();

  // Enhanced increment with analytics
  const increment = useCallback(() => {
    const newCount = count + 1;
    setCount(newCount);
    setHistory((prev) => [...prev, newCount].slice(-20)); // Keep last 20
    setClickCount(prev => prev + 1);
    setLastActionTime(Date.now());
  }, [count]);

  // Enhanced decrement with analytics
  const decrement = useCallback(() => {
    const newCount = count - 1;
    setCount(newCount);
    setHistory((prev) => [...prev, newCount].slice(-20));
    setClickCount(prev => prev + 1);
    setLastActionTime(Date.now());
  }, [count]);

  // Smart reset with confirmation for large values
  const reset = useCallback(() => {
    if (Math.abs(count) > 50) {
      if (!confirm(`Reset counter from ${count} to 0?`)) return;
    }
    setCount(0);
    setHistory([0]);
    setClickCount(0);
    setLastActionTime(Date.now());
  }, [count]);

  // Auto-increment towards target
  useEffect(() => {
    if (!autoMode || !isReady) return;

    const timer = safeInterval(() => {
      setCount(prev => {
        if (prev < targetValue) {
          const newCount = prev + 1;
          setHistory((hist) => [...hist, newCount].slice(-20));
          return newCount;
        } else if (prev > targetValue) {
          const newCount = prev - 1;
          setHistory((hist) => [...hist, newCount].slice(-20));
          return newCount;
        }
        return prev;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [autoMode, targetValue, speed, isReady, safeInterval]);

  // Enhanced keyboard shortcuts with more options
  useEffect(() => {
    if (!isReady) return;

    const handleKeyPress = safeExecute((e) => {
      if (e.target.tagName === 'INPUT') return;

      switch (e.key) {
        case 'ArrowUp':
        case '+':
        case '=':
          e.preventDefault();
          increment();
          break;
        case 'ArrowDown':
        case '-':
          e.preventDefault();
          decrement();
          break;
        case '0':
        case 'r':
        case 'R':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            reset();
          }
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          setShowHistory(prev => !prev);
          break;
        case 'a':
        case 'A':
          e.preventDefault();
          setAutoMode(prev => !prev);
          break;
        case ' ':
          e.preventDefault();
          if (count < targetValue) increment();
          else if (count > targetValue) decrement();
          break;
      }
    });

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [increment, decrement, reset, count, targetValue, isReady, safeExecute]);

  // Advanced analytics
  const analytics = useMemo(() => {
    const trend = history.length > 1 
      ? history[history.length - 1] - history[history.length - 2]
      : 0;
    
    const max = Math.max(...history);
    const min = Math.min(...history);
    const avg = history.length > 0 
      ? Math.round(history.reduce((a, b) => a + b, 0) / history.length)
      : 0;
    
    const volatility = history.length > 2
      ? Math.round(Math.sqrt(
          history.map(val => Math.pow(val - avg, 2))
                 .reduce((a, b) => a + b, 0) / history.length
        ))
      : 0;

    return { trend, max, min, avg, volatility };
  }, [history]);

  // Progress to target
  const progressToTarget = useMemo(() => {
    if (targetValue === 0) return 100;
    return Math.min(100, Math.max(0, (count / targetValue) * 100));
  }, [count, targetValue]);

  // Dynamic color based on value
  const getCountColor = () => {
    if (count === 0) return 'text-gray-500';
    if (count > 0) return count >= targetValue ? 'text-green-500' : 'text-blue-500';
    return 'text-red-500';
  };

  // Animation variants
  const countVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    exit: { scale: 1.2, opacity: 0, transition: { duration: 0.2 } }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  return (
    <div className='w-full max-w-2xl mx-auto p-6'>
      <div className='rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-xl dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h2 className='mb-2 text-3xl font-bold text-gray-900 dark:text-white'>
            🧮 Advanced Interactive Counter
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Enhanced with analytics, auto-mode, and {deviceInfo.isTouchDevice ? 'touch' : 'keyboard'} controls
          </p>
        </div>

        {/* Main Counter Display */}
        <div className='mb-8 text-center'>
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              variants={countVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`text-8xl font-bold ${getCountColor()}`}
            >
              {count.toLocaleString()}
            </motion.div>
          </AnimatePresence>
          
          {/* Progress to target */}
          <div className='mt-4'>
            <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2'>
              <span>Progress to target ({targetValue})</span>
              <span>{Math.round(progressToTarget)}%</span>
            </div>
            <div className='h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
              <motion.div
                className={`h-full ${
                  count >= targetValue ? 'bg-green-500' : 
                  count < 0 ? 'bg-red-500' : 'bg-blue-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${progressToTarget}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className='mb-8 flex flex-wrap justify-center gap-4'>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={decrement}
            className='flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3 font-bold text-white shadow-lg hover:bg-red-600 transition-colors'
          >
            <Minus className='h-5 w-5' />
            Decrease
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={reset}
            className='flex items-center gap-2 rounded-xl bg-gray-500 px-6 py-3 font-bold text-white shadow-lg hover:bg-gray-600 transition-colors'
          >
            <RotateCcw className='h-5 w-5' />
            Reset
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={increment}
            className='flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-bold text-white shadow-lg hover:bg-green-600 transition-colors'
          >
            <Plus className='h-5 w-5' />
            Increase
          </motion.button>
        </div>

        {/* Advanced Controls */}
        <div className='mb-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Target Value */}
          <div className='space-y-2'>
            <label className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
              <Target className='h-4 w-4' />
              Target Value
            </label>
            <input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(Number(e.target.value))}
              className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
          </div>

          {/* Auto Mode Speed */}
          <div className='space-y-2'>
            <label className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
              <Zap className='h-4 w-4' />
              Auto Speed (ms)
            </label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className='w-full'
            />
            <div className='text-xs text-gray-500 dark:text-gray-400'>{speed}ms</div>
          </div>
        </div>

        {/* Auto Mode Toggle */}
        <div className='mb-6 flex items-center justify-center'>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setAutoMode(prev => !prev)}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white shadow-lg transition-colors ${
              autoMode 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            <Zap className='h-5 w-5' />
            {autoMode ? 'Stop Auto Mode' : 'Start Auto Mode'}
          </motion.button>
        </div>

        {/* Analytics */}
        <div className='mb-6 grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <div className='text-lg font-bold text-blue-600 dark:text-blue-400'>
              {analytics.trend > 0 ? '+' : ''}{analytics.trend}
            </div>
            <div className='text-xs text-gray-600 dark:text-gray-400'>Trend</div>
          </div>
          <div className='text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg'>
            <div className='text-lg font-bold text-green-600 dark:text-green-400'>
              {analytics.max}
            </div>
            <div className='text-xs text-gray-600 dark:text-gray-400'>Max</div>
          </div>
          <div className='text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg'>
            <div className='text-lg font-bold text-red-600 dark:text-red-400'>
              {analytics.min}
            </div>
            <div className='text-xs text-gray-600 dark:text-gray-400'>Min</div>
          </div>
          <div className='text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg'>
            <div className='text-lg font-bold text-purple-600 dark:text-purple-400'>
              {analytics.avg}
            </div>
            <div className='text-xs text-gray-600 dark:text-gray-400'>Average</div>
          </div>
        </div>

        {/* History Toggle and Display */}
        <div className='space-y-4'>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowHistory(prev => !prev)}
            className='flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 font-bold text-white shadow-lg hover:bg-indigo-600 transition-colors w-full justify-center'
          >
            <History className='h-5 w-5' />
            {showHistory ? 'Hide' : 'Show'} History ({history.length} entries)
          </motion.button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='overflow-hidden'
              >
                <div className='rounded-lg bg-gray-100 p-4 dark:bg-gray-800'>
                  <h3 className='mb-3 flex items-center gap-2 font-bold text-gray-900 dark:text-white'>
                    <TrendingUp className='h-5 w-5' />
                    Value History
                  </h3>
                  <div className='grid grid-cols-10 gap-2'>
                    {history.slice(-20).map((value, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`rounded text-center text-sm font-bold p-2 ${
                          value > 0 ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' :
                          value < 0 ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' :
                          'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {value}
                      </motion.div>
                    ))}
                  </div>
                  <div className='mt-3 text-xs text-gray-600 dark:text-gray-400'>
                    Total clicks: {clickCount} | Volatility: {analytics.volatility}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className='mt-6 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20'>
          <h4 className='mb-2 font-bold text-yellow-800 dark:text-yellow-200'>
            ⌨️ Keyboard Shortcuts:
          </h4>
          <div className='text-sm text-yellow-700 dark:text-yellow-300 grid grid-cols-2 gap-2'>
            <div>↑/+ : Increment</div>
            <div>↓/- : Decrement</div>
            <div>Ctrl+R : Reset</div>
            <div>H : Toggle History</div>
            <div>A : Toggle Auto Mode</div>
            <div>Space : Move to Target</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCounter;
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [count]);

  return (
    <div className='card mx-auto max-w-md'>
      <div className='text-center'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>
          Interactive Counter
          <span className='mt-1 block text-sm font-normal text-gray-500 dark:text-gray-400'>
            React Island Component
          </span>
        </h3>

        {/* Counter Display */}
        <motion.div
          key={count}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className='mb-6'
        >
          <div
            className={`mb-2 text-6xl font-bold ${
              count > 0
                ? 'text-green-500'
                : count < 0
                  ? 'text-red-500'
                  : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            {count}
          </div>
          <div className='text-sm text-gray-500 dark:text-gray-400'>
            {count === 0 ? 'Neutral' : count > 0 ? 'Positive' : 'Negative'}
          </div>
        </motion.div>

        {/* Controls */}
        <div className='mb-6 flex items-center justify-center space-x-4'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={decrement}
            className='btn-secondary rounded-full p-3'
            aria-label='Decrement counter'
          >
            <Minus className='h-5 w-5' />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className='btn-ghost rounded-full p-3'
            aria-label='Reset counter'
          >
            <RotateCcw className='h-5 w-5' />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={increment}
            className='btn-primary rounded-full p-3'
            aria-label='Increment counter'
          >
            <Plus className='h-5 w-5' />
          </motion.button>
        </div>

        {/* Keyboard Shortcuts */}
        <div className='mb-4 space-y-1 text-xs text-gray-500 dark:text-gray-400'>
          <div>Keyboard shortcuts:</div>
          <div>↑/+ to increment, ↓/- to decrement, Ctrl+R to reset</div>
        </div>

        {/* History Toggle */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className='mb-4 text-sm text-primary-600 hover:underline dark:text-primary-400'
        >
          {showHistory ? 'Hide' : 'Show'} History ({history.length})
        </button>

        {/* History */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className='overflow-hidden border-t border-gray-200 pt-4 dark:border-gray-700'
            >
              <div className='mb-2 text-sm text-gray-600 dark:text-gray-400'>
                Recent values:
              </div>
              <div className='flex flex-wrap justify-center gap-2'>
                {history.slice(-8).map((value, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`rounded px-2 py-1 text-xs ${
                      value > 0
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : value < 0
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {value}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractiveCounter;
