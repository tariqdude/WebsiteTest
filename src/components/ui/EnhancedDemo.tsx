import { useState } from 'react';

interface EnhancedDemoProps {
  title?: string;
  type?: 'counter' | 'color' | 'message' | 'combined';
  initialColor?: string;
  showColorPicker?: boolean;
  showCounter?: boolean;
  showMessage?: boolean;
}

const EnhancedDemo = ({
  title = 'Enhanced React Demo',
  type = 'combined',
  initialColor = '#3B82F6',
  showColorPicker = true,
  showCounter = true,
  showMessage = false,
}: EnhancedDemoProps) => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Hello from Enhanced React!');
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const colors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4',
    '#F97316',
    '#84CC16',
    '#EC4899',
    '#6366F1',
    '#14B8A6',
    '#F472B6',
  ];

  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => setCount(count - 1);
  const handleReset = () => setCount(0);

  const generateRandomColor = () => {
    const randomHex = () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0');
    setSelectedColor(`#${randomHex()}${randomHex()}${randomHex()}`);
  };

  const selectPresetColor = (color: string) => setSelectedColor(color);

  // Legacy support for old component types
  if (type === 'counter') {
    return renderCounter();
  }
  if (type === 'color') {
    return renderColorPicker();
  }
  if (type === 'message') {
    return renderMessage();
  }

  // Enhanced combined view
  return (
    <div className='card mx-auto max-w-lg rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800'>
      <h3 className='mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white'>
        {title}
      </h3>

      <div className='space-y-6'>
        {showCounter && (
          <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
            <h4 className='mb-3 text-center text-lg font-semibold text-gray-800 dark:text-gray-200'>
              Interactive Counter
            </h4>
            <div className='text-center'>
              <div
                className='mb-4 text-5xl font-bold transition-colors duration-300'
                style={
                  {
                    '--dynamic-color': selectedColor,
                    color: 'var(--dynamic-color)',
                  } as React.CSSProperties
                }
              >
                {count}
              </div>
              <div className='flex justify-center space-x-2'>
                <button
                  onClick={handleDecrement}
                  className='rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500'
                >
                  -
                </button>
                <button
                  onClick={handleReset}
                  className='rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
                >
                  Reset
                </button>
                <button
                  onClick={handleIncrement}
                  className='rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500'
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {showColorPicker && (
          <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
            <h4 className='mb-3 text-center text-lg font-semibold text-gray-800 dark:text-gray-200'>
              Color Picker
            </h4>
            <div className='text-center'>
              <div
                className='mx-auto mb-3 h-20 w-20 transform rounded-full border-4 border-white shadow-lg transition-all duration-300 hover:scale-110'
                style={{ backgroundColor: selectedColor }}
              ></div>
              <p className='mb-3 rounded bg-gray-100 px-3 py-1 font-mono text-sm text-gray-600 dark:bg-gray-600 dark:text-gray-300'>
                {selectedColor}
              </p>
              <div className='mb-3 grid grid-cols-6 gap-2'>
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => selectPresetColor(color)}
                    className='h-8 w-8 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
              <button
                onClick={generateRandomColor}
                className='w-full rounded-lg bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                Random Color
              </button>
            </div>
          </div>
        )}

        {showMessage && (
          <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
            <h4 className='mb-3 text-center text-lg font-semibold text-gray-800 dark:text-gray-200'>
              Message Editor
            </h4>
            <div className='text-center'>
              <p className='mb-3 text-lg text-gray-700 dark:text-gray-300'>
                {message}
              </p>
              <input
                type='text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                placeholder='Type your message...'
              />
            </div>
          </div>
        )}
      </div>

      <div className='mt-6 text-center text-sm text-gray-600 dark:text-gray-400'>
        ✅ Enhanced React Component Working!
      </div>
    </div>
  );

  function renderCounter() {
    return (
      <div className='card mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800'>
        <h3 className='mb-4 text-center text-xl font-bold text-gray-900 dark:text-white'>
          {title}
        </h3>
        <div className='mb-6 text-center'>
          <div
            className='mb-4 text-6xl font-bold transition-colors duration-300'
            style={{ color: selectedColor }}
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

  function renderColorPicker() {
    return (
      <div className='card mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800'>
        <h3 className='mb-4 text-center text-xl font-bold text-gray-900 dark:text-white'>
          {title}
        </h3>
        <div className='mb-4 text-center'>
          <div
            className='mx-auto mb-4 h-24 w-24 transform rounded-full border-4 border-white shadow-lg transition-all duration-300 hover:scale-110'
            style={{ backgroundColor: selectedColor }}
          ></div>
          <p className='mb-4 rounded bg-gray-100 px-3 py-1 font-mono text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300'>
            {selectedColor}
          </p>
          <div className='mb-4 grid grid-cols-4 gap-2'>
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => selectPresetColor(color)}
                className='h-8 w-8 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500'
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
          <button
            onClick={generateRandomColor}
            className='w-full rounded-lg bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            Random Color
          </button>
        </div>
        <div className='text-center text-sm text-gray-600 dark:text-gray-400'>
          ✅ React Color Demo Working!
        </div>
      </div>
    );
  }

  function renderMessage() {
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
};

export default EnhancedDemo;
