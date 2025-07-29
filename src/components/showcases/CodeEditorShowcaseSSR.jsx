import { useState, useEffect, useRef } from 'react';
import { Play, Copy, Download } from 'lucide-react';

const CodeEditorShowcase = () => {
  const [code, setCode] = useState(`// Welcome to the Monaco Code Editor
import { useState, useEffect } from 'react';

function ExampleComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('Count updated:', count);
  }, [count]);
  
  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default ExampleComponent;`);

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold">Code Editor Showcase</h3>
        <div className="flex space-x-2">
          <button className="btn-secondary">
            <Play className="h-4 w-4" />
          </button>
          <button className="btn-secondary">
            <Copy className="h-4 w-4" />
          </button>
          <button className="btn-secondary">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <textarea 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded p-4"
        />
      </div>
    </div>
  );
};

export default CodeEditorShowcase;
```