import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ code, language = 'javascript', title = '' }) => {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState(code);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  useEffect(() => {
    // Simple syntax highlighting for demo purposes
    const highlight = (code, lang) => {
      const keywords = {
        javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'default'],
        astro: ['---', 'export', 'import', 'const', 'let', 'var'],
        css: ['@apply', '@layer', '@keyframes', 'from', 'to'],
      };

      let highlighted = code;
      
      if (keywords[lang]) {
        keywords[lang].forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'g');
          highlighted = highlighted.replace(regex, `<span class="text-purple-400 font-semibold">${keyword}</span>`);
        });
      }

      // Highlight strings
      highlighted = highlighted.replace(/(["'])(.*?)\1/g, '<span class="text-green-400">$1$2$1</span>');
      
      // Highlight comments
      highlighted = highlighted.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="text-gray-500 italic">$1</span>');
      
      // Highlight numbers
      highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, '<span class="text-yellow-400">$&</span>');

      return highlighted;
    };

    setHighlightedCode(highlight(code, language));
  }, [code, language]);

  return (
    <div className="relative group">
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
        {title && (
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 ml-4 text-sm">{title}</span>
            </div>
            <button
              onClick={copyToClipboard}
              className="text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm">
            <code 
              className="text-gray-300"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
