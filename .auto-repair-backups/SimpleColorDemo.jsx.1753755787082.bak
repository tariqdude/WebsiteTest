import { useState } from 'react';

const SimpleColorDemo = ({ title = 'Color Picker Demo' }) => {
  const [selectedColor, setSelectedColor] = useState('#3B82F6');

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

  const generateRandomColor = () => {
    const randomHex = () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0');
    setSelectedColor(`#${randomHex()}${randomHex()}${randomHex()}`);
  };

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
              onClick={() => setSelectedColor(color)}
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
};

export default SimpleColorDemo;
