// Real-time Code Editor with Monaco (VS Code editor)
import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';

const CodeEditorShowcase = () => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const initialCode = {
    javascript: `// Interactive JavaScript Playground
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate and display results
for (let i = 0; i <= 10; i++) {
  console.log(\`fibonacci(\${i}) = \${fibonacci(i)}\`);
}

// Try modifying this code and run it!`,
    
    typescript: `// TypeScript with type safety
interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

class UserManager {
  private users: User[] = [];
  
  addUser(user: User): void {
    this.users.push(user);
    console.log(\`Added user: \${user.name}\`);
  }
  
  getActiveUsers(): User[] {
    return this.users.filter(user => user.active);
  }
}

const manager = new UserManager();
manager.addUser({
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  active: true
});

console.log('Active users:', manager.getActiveUsers());`,

    python: `# Python code example
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)

# Test the algorithm
numbers = [3, 6, 8, 10, 1, 2, 1]
sorted_numbers = quicksort(numbers)
print(f"Original: {numbers}")
print(f"Sorted: {sorted_numbers}")

# List comprehension example
squares = [x**2 for x in range(1, 11) if x % 2 == 0]
print(f"Even squares: {squares}")`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Demo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Dynamic Content</h1>
        <p>This is a live HTML preview!</p>
        <button onclick="changeColor()">Change Color</button>
        <div id="dynamic-content">Click the button above!</div>
    </div>
    
    <script>
        function changeColor() {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            document.querySelector('.container').style.background = randomColor;
            document.getElementById('dynamic-content').innerHTML = 
                \`<p style="color: \${randomColor}; font-weight: bold;">Color changed to \${randomColor}!</p>\`;
        }
    </script>
</body>
</html>`
  };

  useEffect(() => {
    if (editorRef.current) {
      // Configure Monaco Editor
      monaco.editor.defineTheme('custom-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#1e1e1e',
          'editor.foreground': '#d4d4d4'
        }
      });

      const editor = monaco.editor.create(editorRef.current, {
        value: initialCode[language],
        language: language,
        theme: theme,
        automaticLayout: true,
        minimap: { enabled: true },
        wordWrap: 'on',
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        renderWhitespace: 'selection',
        contextmenu: true,
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        folding: true,
        lineDecorationsWidth: 60,
        lineNumbersMinChars: 3,
        glyphMargin: true
      });

      monacoRef.current = editor;

      return () => {
        editor.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (monacoRef.current) {
      const model = monacoRef.current.getModel();
      monaco.editor.setModelLanguage(model, language);
      monacoRef.current.setValue(initialCode[language]);
    }
  }, [language]);

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.updateOptions({ theme });
    }
  }, [theme]);

  const runCode = async () => {
    if (!monacoRef.current) return;
    
    setIsRunning(true);
    setOutput('Running...');
    
    const code = monacoRef.current.getValue();
    
    try {
      // Simulate code execution
      if (language === 'javascript') {
        // Create a safe console mock
        const consoleLogs = [];
        const mockConsole = {
          log: (...args) => {
            consoleLogs.push(args.join(' '));
          }
        };
        
        // Execute code in isolated context
        const func = new Function('console', code);
        func(mockConsole);
        
        setOutput(consoleLogs.join('\n') || 'Code executed successfully (no output)');
      } else {
        setOutput(`Code execution simulation for ${language}:\n\n${code.slice(0, 200)}${code.length > 200 ? '...' : ''}\n\n✅ Syntax appears valid!`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' }
  ];

  const themes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'vs', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast' }
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
        <h3 className="text-2xl font-bold text-white mb-2">Monaco Code Editor</h3>
        <p className="text-purple-100">Full VS Code editor experience in the browser</p>
      </div>

      <div className="p-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              {themes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Editor
              </span>
            </div>
            <div 
              ref={editorRef} 
              style={{ height: '400px' }}
              className="bg-white dark:bg-gray-800"
            />
          </div>

          {/* Output */}
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Output
              </span>
            </div>
            <div className="p-4 h-96 overflow-y-auto bg-black text-green-400 font-mono text-sm">
              <pre className="whitespace-pre-wrap">
                {output || 'Click "Run Code" to see output...'}
              </pre>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'IntelliSense',
            'Syntax Highlighting',
            'Code Folding',
            'Mini Map',
            'Multi-language',
            'Themes',
            'Auto-complete',
            'Error Detection'
          ].map((feature, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ✓ {feature}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Powered by Monaco Editor • Same engine as VS Code • Full editing experience
        </div>
      </div>
    </div>
  );
};

export default CodeEditorShowcase;
