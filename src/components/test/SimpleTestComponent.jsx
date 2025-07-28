import { useState, useEffect } from 'react';

const SimpleTestComponent = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('SimpleTestComponent mounted');
  }, []);

  return (
    <div
      style={{
        padding: '20px',
        border: '2px solid blue',
        margin: '10px',
        backgroundColor: 'lightblue',
      }}
    >
      <h3>Simple Test Component</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
};

export default SimpleTestComponent;
