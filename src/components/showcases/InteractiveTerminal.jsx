import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

const InteractiveTerminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [currentPath, setCurrentPath] = useState('~/astro-showcase');
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

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
        '  npm      - Show package info'
      ]
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
        'README.md'
      ]
    },
    pwd: {
      description: 'Print working directory',
      execute: () => [currentPath]
    },
    whoami: {
      description: 'Show current user',
      execute: () => ['developer@astro-showcase']
    },
    date: {
      description: 'Show current date and time',
      execute: () => [new Date().toString()]
    },
    clear: {
      description: 'Clear terminal',
      execute: () => {
        setHistory([]);
        return [];
      }
    },
    astro: {
      description: 'Show Astro project information',
      execute: () => [
        '🚀 Astro Project Info:',
        '  Version: 4.16.18',
        '  Mode: Static Site Generation',
        '  Islands: React + Vue',
        '  Features: Content Collections, View Transitions',
        '  Build: Ready for GitHub Pages'
      ]
    },
    npm: {
      description: 'Show package information',
      execute: () => [
        '📦 Package Info:',
        '  Name: astro-showcase',
        '  Version: 1.0.0',
        '  Dependencies: astro, react, vue, tailwindcss',
        '  Scripts: dev, build, preview'
      ]
    }
  };

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const newEntry = {
      type: 'command',
      path: currentPath,
      command: cmd,
      timestamp: new Date()
    };

    if (trimmedCmd === '') {
      setHistory(prev => [...prev, newEntry]);
      return;
    }

    if (commands[trimmedCmd]) {
      const output = commands[trimmedCmd].execute();
      setHistory(prev => [...prev, newEntry, { type: 'output', content: output }]);
    } else {
      setHistory(prev => [...prev, newEntry, { 
        type: 'error', 
        content: [`Command not found: ${cmd}`, 'Type "help" for available commands'] 
      }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      // Could implement command history navigation here
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    // Welcome message
    setHistory([{
      type: 'output',
      content: [
        'Welcome to Astro Showcase Terminal!',
        'Type "help" to see available commands.',
        ''
      ]
    }]);
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <TerminalIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-sm font-mono">Interactive Terminal</span>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="h-80 p-4 overflow-y-auto font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-1">
            {entry.type === 'command' && (
              <div className="flex items-center space-x-2">
                <span className="text-green-400">$</span>
                <span className="text-blue-400">{entry.path}</span>
                <span className="text-white">{entry.command}</span>
              </div>
            )}
            {entry.type === 'output' && (
              <div className="text-gray-300 ml-4">
                {entry.content.map((line, lineIndex) => (
                  <div key={lineIndex}>{line}</div>
                ))}
              </div>
            )}
            {entry.type === 'error' && (
              <div className="text-red-400 ml-4">
                {entry.content.map((line, lineIndex) => (
                  <div key={lineIndex}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <span className="text-green-400">$</span>
          <span className="text-blue-400">{currentPath}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white outline-none font-mono"
            placeholder="Enter command..."
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
};

export default InteractiveTerminal;
