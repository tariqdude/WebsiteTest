import { useState, useEffect } from 'react';

const DebugComponent = () => {
  const [mounted, setMounted] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    console.log('DebugComponent: useEffect triggered');
    setMounted(true);
    setRenderCount((prev) => prev + 1);
  }, []);

  console.log('DebugComponent: Rendering', { mounted, renderCount });

  return (
    <div
      style={{
        padding: '20px',
        border: '2px solid red',
        margin: '10px',
        backgroundColor: mounted ? 'lightgreen' : 'lightcoral',
      }}
    >
      <h3>Debug Component</h3>
      <p>Mounted: {mounted ? 'YES' : 'NO'}</p>
      <p>Render Count: {renderCount}</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  );
};

export default DebugComponent;
