import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, RotateCcw } from 'lucide-react';

const InteractiveCounter = () => {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([0]);
  const [showHistory, setShowHistory] = useState(false);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    setHistory((prev) => [...prev, newCount].slice(-10)); // Keep last 10
  };

  const decrement = () => {
    const newCount = count - 1;
    setCount(newCount);
    setHistory((prev) => [...prev, newCount].slice(-10));
  };

  const reset = () => {
    setCount(0);
    setHistory([0]);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT') return;

      switch (e.key) {
        case 'ArrowUp':
        case '+':
          e.preventDefault();
          increment();
          break;
        case 'ArrowDown':
        case '-':
          e.preventDefault();
          decrement();
          break;
        case 'r':
        case 'R':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            reset();
          }
          break;
      }
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
