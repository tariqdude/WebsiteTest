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

  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [monaco, setMonaco] = useState(null);
  const [editor, setEditor] = useState(null);
  const editorRef = useRef(null);

  // SSR-safe mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Dynamic Monaco loading
  useEffect(() => {
    if (!isMounted) return;

    const loadMonaco = async () => {
      try {
        const monacoModule = await import('monaco-editor');
        setMonaco(monacoModule);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load Monaco Editor:', error);
        setIsLoading(false);
      }
    };

    loadMonaco();
  }, [isMounted]);

  // Initialize editor when Monaco is loaded
  useEffect(() => {
    if (!monaco || !editorRef.current) return;

    const editorInstance = monaco.editor.create(editorRef.current, {
      value: code,
      language: language,
      theme: theme,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
    });

    setEditor(editorInstance);

    const updateCode = () => {
      setCode(editorInstance.getValue());
    };

    editorInstance.onDidChangeModelContent(updateCode);

    return () => {
      editorInstance.dispose();
    };
  }, [monaco, language, theme]);

  const executeCode = () => {
    if (!code.trim()) {
      setOutput('No code to execute');
      return;
    }

    try {
      // Simulate code execution
      setOutput(
        `// Executing ${language} code...\n// Code execution simulated\n// Output: Success!`
      );
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const copyCode = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        setOutput('Code copied to clipboard!');
      }
    } catch (error) {
      setOutput('Failed to copy code');
    }
  };

  const downloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `code.${language === 'javascript' ? 'js' : language}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setOutput('Code downloaded!');
  };

  // SSR fallback
  if (!isMounted) {
    return (
      <div className='flex min-h-[600px] items-center justify-center overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <h3 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
            Code Editor Loading
          </h3>
          <p className='text-gray-600 dark:text-gray-400'>
            Preparing Monaco Editor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800'>
      <div className='border-b border-gray-200 p-6 dark:border-gray-700'>
        <h3 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
          💻 Advanced Code Editor
        </h3>
        <p className='text-gray-600 dark:text-gray-300'>
          Monaco Editor with syntax highlighting and code execution
        </p>
      </div>

      <div className='border-b border-gray-200 p-4 dark:border-gray-700'>
        <div className='flex flex-wrap items-center gap-4'>
          <div className='flex items-center gap-2'>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Language:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className='rounded border border-gray-300 bg-white px-3 py-1 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            >
              <option value='javascript'>JavaScript</option>
              <option value='typescript'>TypeScript</option>
              <option value='html'>HTML</option>
              <option value='css'>CSS</option>
              <option value='json'>JSON</option>
            </select>
          </div>

          <div className='flex items-center gap-2'>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Theme:
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className='rounded border border-gray-300 bg-white px-3 py-1 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            >
              <option value='vs-dark'>Dark</option>
              <option value='vs'>Light</option>
              <option value='hc-black'>High Contrast</option>
            </select>
          </div>

          <div className='ml-auto flex gap-2'>
            <button
              onClick={executeCode}
              className='flex items-center gap-2 rounded bg-green-600 px-3 py-1 text-white transition-colors hover:bg-green-700'
            >
              <Play className='h-4 w-4' />
              Run
            </button>
            <button
              onClick={copyCode}
              className='flex items-center gap-2 rounded bg-blue-600 px-3 py-1 text-white transition-colors hover:bg-blue-700'
            >
              <Copy className='h-4 w-4' />
              Copy
            </button>
            <button
              onClick={downloadCode}
              className='flex items-center gap-2 rounded bg-purple-600 px-3 py-1 text-white transition-colors hover:bg-purple-700'
            >
              <Download className='h-4 w-4' />
              Download
            </button>
          </div>
        </div>
      </div>

      <div className='flex h-96'>
        <div className='relative flex-1'>
          {isLoading ? (
            <div className='absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900'>
              <div className='text-center'>
                <div className='mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
                <p className='text-gray-600 dark:text-gray-400'>
                  Loading Editor...
                </p>
              </div>
            </div>
          ) : (
            <div ref={editorRef} className='h-full w-full' />
          )}
        </div>

        <div className='w-1/3 border-l border-gray-200 dark:border-gray-700'>
          <div className='border-b border-gray-200 p-4 dark:border-gray-700'>
            <h4 className='font-semibold text-gray-900 dark:text-white'>
              Output
            </h4>
          </div>
          <div className='p-4'>
            <pre className='whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300'>
              {output || 'Click "Run" to execute code...'}
            </pre>
          </div>
        </div>
      </div>

      <div className='bg-gray-50 p-4 dark:bg-gray-700'>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
          <strong>Features:</strong> Monaco Editor, syntax highlighting,
          multiple languages, themes
        </p>
      </div>
    </div>
  );
};

export default CodeEditorShowcase;
