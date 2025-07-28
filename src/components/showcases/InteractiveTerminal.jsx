import { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

// Custom hook for managing terminal state and logic
const useTerminal = () => {
  const [history, setHistory] = useState([]);
  const [currentPath, setCurrentPath] = useState('~/astro-showcase');

  const commands = {
    help: {
      description: 'Show available commands',
      execute: () => [
        'Available commands:',
        '  help     - Show this help message',
        '  ls       - List files and directories',
        '  pwd      - Print working directory',
        '  whoami   - Show current user',
        '  date     - Show current date and time',
        '  clear    - Clear terminal',
        '  astro    - Show Astro project info',
        '  npm      - Show package info',
      ],
    },
    ls: {
      description: 'List directory contents',
      execute: () => [
        'src/',
        'public/',
        'package.json',
        'astro.config.mjs',
        'tsconfig.json',
        'tailwind.config.mjs',
        'README.md',
      ],
    },
    pwd: {
      description: 'Print working directory',
      execute: () => [currentPath],
    },
    whoami: {
      description: 'Show current user',
      execute: () => ['developer@astro-showcase'],
    },
    date: {
      description: 'Show current date and time',
      execute: () => [new Date().toString()],
    },
    clear: {
      description: 'Clear terminal',
      execute: () => {
        setHistory([]);
        return [];
      },
    },
    astro: {
      description: 'Show Astro project information',
      execute: () => [
        '🚀 Astro Project Info:',
        '  Version: 5.x',
        '  Mode: Static Site Generation',
        '  Islands: React, Vue, Svelte, Solid, Preact',
        '  Features: Content Collections, View Transitions',
        '  Build: Ready for GitHub Pages',
      ],
    },
    npm: {
      description: 'Show package information',
      execute: () => [
        '📦 Package Info:',
        '  Name: astro-multi-framework-showcase',
        '  Version: 1.0.0',
        '  Dependencies: astro, react, vue, svelte, solid-js, preact, tailwindcss',
        '  Scripts: dev, build, preview, lint, check',
      ],
    },
  };

  const executeCommand = useCallback(
    (cmd) => {
      const trimmedCmd = cmd.trim().toLowerCase();
      const newEntry = {
        type: 'command',
        path: currentPath,
        command: cmd,
        timestamp: new Date(),
      };

      if (trimmedCmd === '') {
        setHistory((prev) => [...prev, newEntry]);
        return;
      }

      if (commands[trimmedCmd]) {
        const output = commands[trimmedCmd].execute();
        setHistory((prev) => [
          ...prev,
          newEntry,
          { type: 'output', content: output },
        ]);
      } else {
        setHistory((prev) => [
          ...prev,
          newEntry,
          {
            type: 'error',
            content: [
              `Command not found: ${cmd}`,
              'Type "help" for available commands',
            ],
          },
        ]);
      }
    },
    [currentPath, commands]
  );

  useEffect(() => {
    // Welcome message
    setHistory([
      {
        type: 'output',
        content: [
          'Welcome to the Astro Multi-Framework Showcase Terminal!',
          'This is a simulated terminal experience.',
          'Type "help" to see available commands.',
          '',
        ],
      },
    ]);
  }, []);

  return { history, currentPath, executeCommand };
};

const InteractiveTerminal = () => {
  const [input, setInput] = useState('');
  const { history, currentPath, executeCommand } = useTerminal();
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className='overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-lg'>
      <div className='flex items-center space-x-2 border-b border-gray-700 bg-gray-800 px-4 py-2'>
        <div className='flex space-x-2'>
          <div className='h-3 w-3 rounded-full bg-red-500'></div>
          <div className='h-3 w-3 rounded-full bg-yellow-500'></div>
          <div className='h-3 w-3 rounded-full bg-green-500'></div>
        </div>
        <div className='ml-4 flex items-center space-x-2'>
          <TerminalIcon className='h-4 w-4 text-gray-400' />
          <span className='font-mono text-sm text-gray-400'>
            Interactive Terminal
          </span>
        </div>
      </div>

      <div
        ref={terminalRef}
        className='h-80 overflow-y-auto p-4 font-mono text-sm'
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, index) => (
          <div key={index} className='mb-1'>
            {entry.type === 'command' && (
              <div className='flex items-center space-x-2'>
                <span className='text-green-400'>$</span>
                <span className='text-blue-400'>{entry.path}</span>
                <span className='text-white'>{entry.command}</span>
              </div>
            )}
            {entry.type === 'output' && (
              <div className='ml-4 text-gray-300'>
                {entry.content.map((line, lineIndex) => (
                  <div key={lineIndex}>{line}</div>
                ))}
              </div>
            )}
            {entry.type === 'error' && (
              <div className='ml-4 text-red-400'>
                {entry.content.map((line, lineIndex) => (
                  <div key={lineIndex}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}

        <form onSubmit={handleSubmit} className='flex items-center space-x-2'>
          <span className='text-green-400'>$</span>
          <span className='text-blue-400'>{currentPath}</span>
          <input
            ref={inputRef}
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='flex-1 bg-transparent font-mono text-white outline-none'
            placeholder='Enter command...'
            autoComplete='off'
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};

export default InteractiveTerminal;
