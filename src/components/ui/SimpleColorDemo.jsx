import { useState } from 'react';

const SimpleColorDemo = ({ title = "Color Picker Demo" }) => {
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#06B6D4', '#F97316', '#84CC16',
    '#EC4899', '#6366F1', '#14B8A6', '#F472B6'
  ];

  const generateRandomColor = () => {
    const randomHex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    setSelectedColor(`#${randomHex()}${randomHex()}${randomHex()}`);
  };

  return (
    <div className="card p-6 max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <h3 className="text-xl font-bold text-center mb-4 text-gray-900 dark:text-white">
        {title}
      </h3>
      
      <div className="text-center mb-4">
        <div 
          className="w-24 h-24 mx-auto rounded-full mb-4 transition-all duration-300 transform hover:scale-110 border-4 border-white shadow-lg"
          style={{ backgroundColor: selectedColor }}
        ></div>
        
        <p className="text-sm font-mono text-gray-600 dark:text-gray-300 mb-4 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
          {selectedColor}
        </p>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
        
        <button 
          onClick={generateRandomColor}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Random Color
        </button>
      </div>
      
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        ✅ React Color Demo Working!
      </div>
    </div>
  );
};

export default SimpleColorDemo;
