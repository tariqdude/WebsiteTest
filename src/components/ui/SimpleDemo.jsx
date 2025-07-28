import { useState } from 'react';

const SimpleDemo = ({ title = 'React Demo', type = 'counter' }) => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Hello from React!');
  const [color, setColor] = useState('#3B82F6');

  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => setCount(count - 1);
  const handleReset = () => setCount(0);

  const generateRandomColor = () => {
    const colors = [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#06B6D4',
    ];
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  if (type === 'counter') {
    return (
      <div className='card mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800'>
        <h3 className='mb-4 text-center text-xl font-bold text-gray-900 dark:text-white'>
          {title}
        </h3>

        <div className='mb-6 text-center'>
          <div
            className='mb-4 text-6xl font-bold transition-colors duration-300'
            style={{ color: color }}
          >
            {count}
          </div>

          <div className='flex justify-center space-x-3'>
            <button
              onClick={handleDecrement}
              className='rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600'
            >
              -
            </button>
            <button
              onClick={handleReset}
              className='rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600'
            >
              Reset
            </button>
            <button
              onClick={handleIncrement}
              className='rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600'
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={generateRandomColor}
          className='w-full rounded-lg bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600'
        >
          Change Color
        </button>

        <div className='mt-4 text-center text-sm text-gray-600 dark:text-gray-400'>
          ✅ React Component Working!
        </div>
      </div>
    );
  }

  if (type === 'message') {
    return (
      <div className='card mx-auto max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800'>
        <h3 className='mb-4 text-center text-xl font-bold text-gray-900 dark:text-white'>
          {title}
        </h3>

        <div className='mb-4 text-center'>
          <p className='mb-4 text-lg text-gray-700 dark:text-gray-300'>
            {message}
          </p>

          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            placeholder='Type your message...'
          />
        </div>

        <div className='text-center text-sm text-gray-600 dark:text-gray-400'>
          ✅ Interactive React Component
        </div>
      </div>
    );
  }

  return (
    <div className='card mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800'>
      <h3 className='mb-4 text-center text-xl font-bold text-gray-900 dark:text-white'>
        {title}
      </h3>
      <div className='text-center text-lg text-green-600 dark:text-green-400'>
        ✅ React Component Loaded Successfully!
      </div>
    </div>
  );
};

export default SimpleDemo;
