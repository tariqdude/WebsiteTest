import React, { useState, useCallback, useMemo } from 'react';

interface EnhancedDemoProps {
  title?: string;
  type?: 'counter' | 'color' | 'message' | 'combined';
  initialColor?: string;
  showColorPicker?: boolean;
  showCounter?: boolean;
  showMessage?: boolean;
  maxCount?: number;
  minCount?: number;
  colorPalette?: string[];
}

const DEFAULT_COLORS = [
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

const EnhancedDemo = ({
  title = 'Enhanced React Demo',
  type = 'combined',
  initialColor = '#3B82F6',
  showColorPicker = true,
  showCounter = true,
  showMessage = false,
  maxCount = 100,
  minCount = 0,
  colorPalette,
}: EnhancedDemoProps) => {
  // State hooks
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Hello from Enhanced React!');
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [inputMessage, setInputMessage] = useState('');

  // Memoized color palette
  const colors = useMemo(() => colorPalette || DEFAULT_COLORS, [colorPalette]);

  // Counter logic
  const handleIncrement = useCallback(() => {
    setCount((c) => (c < maxCount ? c + 1 : c));
  }, [maxCount]);
  const handleDecrement = useCallback(() => {
    setCount((c) => (c > minCount ? c - 1 : c));
  }, [minCount]);
  const handleReset = useCallback(() => setCount(0), []);

  // Message logic
  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputMessage(e.target.value);
    },
    []
  );
  const handleSetMessage = useCallback(() => {
    if (inputMessage.trim()) setMessage(inputMessage);
    setInputMessage('');
  }, [inputMessage]);

  // Renderers (single set, using Tailwind for color)
  const renderCounter = () => (
    <div className='flex flex-col items-center gap-2'>
      <div
        className={`text-2xl font-bold transition-colors duration-300`}
        style={{ color: 'var(--enhanced-demo-color)' }}
        data-testid='enhanced-counter-value'
      >
        {count}
      </div>
      <div className='flex gap-2'>
        <button
          className='rounded bg-primary-500 px-2 py-1 text-white'
          onClick={handleDecrement}
          disabled={count <= minCount}
        >
          -
        </button>
        <button
          className='rounded bg-primary-500 px-2 py-1 text-white'
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className='rounded bg-primary-500 px-2 py-1 text-white'
          onClick={handleIncrement}
          disabled={count >= maxCount}
        >
          +
        </button>
      </div>
    </div>
  );

  const renderColorPicker = () => (
    <div className='my-2 flex flex-wrap justify-center gap-2'>
      {colors.map((color) => (
        <button
          key={color}
          className={`h-6 w-6 rounded-full border-2 ${selectedColor === color ? 'scale-110 border-primary-700' : 'border-gray-300'}`}
          style={{ background: color }}
          aria-label={`Select color ${color}`}
          onClick={() => selectPresetColor(color)}
        />
      ))}
      <button
        className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-primary-500 text-xs text-primary-500'
        onClick={generateRandomColor}
        aria-label='Random Color'
      >
        ?
      </button>
    </div>
  );

  const renderMessage = () => (
    <div className='flex flex-col items-center gap-2'>
      <div
        className='text-lg font-medium transition-colors duration-300'
        style={{ color: 'var(--enhanced-demo-color)' }}
        data-testid='enhanced-message-value'
      >
        {message}
      </div>
      <div className='flex gap-2'>
        <input
          className='rounded border px-2 py-1'
          type='text'
          value={inputMessage}
          onChange={handleMessageChange}
          placeholder='Type a new message...'
        />
        <button
          className='rounded bg-primary-500 px-2 py-1 text-white'
          onClick={handleSetMessage}
          disabled={!inputMessage.trim()}
        >
          Set
        </button>
      </div>
    </div>
  );

  // Utility: Generate a random color
  const generateRandomColor = useCallback(() => {
    const randomHex = () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0');
    setSelectedColor(`#${randomHex()}${randomHex()}${randomHex()}`);
  }, []);

  // Utility: Select a preset color
  const selectPresetColor = useCallback(
    (color: string) => setSelectedColor(color),
    []
  );

  // Main render logic (single entry point)
  return (
    <section
      className='mx-auto max-w-md rounded-lg bg-white p-4 shadow-md dark:bg-gray-900'
      style={
        {
          ['--enhanced-demo-color' as string]: selectedColor,
        } as React.CSSProperties
      }
      style={
        { ['--enhanced-demo-color']: selectedColor } as React.CSSProperties
      }
    >
      <h2 className='mb-4 text-center text-xl font-semibold'>{title}</h2>
      <div className='flex flex-col gap-4'>
        {(type === 'counter' || type === 'combined') &&
          showCounter &&
          renderCounter()}
        {(type === 'color' || type === 'combined') &&
          showColorPicker &&
          renderColorPicker()}
        {(type === 'message' || type === 'combined') &&
          showMessage &&
          renderMessage()}
      </div>
    </section>
  );
};

export default EnhancedDemo;
