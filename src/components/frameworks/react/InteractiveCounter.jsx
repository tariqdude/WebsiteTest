import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, RotateCcw } from 'lucide-react';

const InteractiveCounter = () => {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([0]);
  const [showHistory, setShowHistory] = useState(false);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    setHistory(prev => [...prev, newCount].slice(-10)); // Keep last 10
  };

  const decrement = () => {
    const newCount = count - 1;
    setCount(newCount);
    setHistory(prev => [...prev, newCount].slice(-10));
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
    <div className="card max-w-md mx-auto">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Interactive Counter
          <span className="block text-sm text-gray-500 dark:text-gray-400 font-normal mt-1">
            React Island Component
          </span>
        </h3>

        {/* Counter Display */}
        <motion.div
          key={count}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="mb-6"
        >
          <div className={`text-6xl font-bold mb-2 ${
            count > 0 ? 'text-green-500' : count < 0 ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'
          }`}>
            {count}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {count === 0 ? 'Neutral' : count > 0 ? 'Positive' : 'Negative'}
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={decrement}
            className="btn-secondary p-3 rounded-full"
            aria-label="Decrement counter"
          >
            <Minus className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="btn-ghost p-3 rounded-full"
            aria-label="Reset counter"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={increment}
            className="btn-primary p-3 rounded-full"
            aria-label="Increment counter"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 space-y-1">
          <div>Keyboard shortcuts:</div>
          <div>↑/+ to increment, ↓/- to decrement, Ctrl+R to reset</div>
        </div>

        {/* History Toggle */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline mb-4"
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
              className="border-t border-gray-200 dark:border-gray-700 pt-4 overflow-hidden"
            >
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Recent values:
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {history.slice(-8).map((value, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`px-2 py-1 rounded text-xs ${
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
