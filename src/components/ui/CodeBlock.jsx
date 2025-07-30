import { useState, useEffect } from 'react';
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
        javascript: [
          'const',
          'let',
          'var',
          'function',
          'return',
          'if',
          'else',
          'for',
          'while',
          'class',
          'import',
          'export',
          'default',
        ],
        astro: ['---', 'export', 'import', 'const', 'let', 'var'],
        css: ['@apply', '@layer', '@keyframes', 'from', 'to'],
      };

      let highlighted = code;

      if (keywords[lang]) {
        keywords[lang].forEach((keyword) => {
          const regex = new RegExp(`\b${keyword}\b`, 'g');
          highlighted = highlighted.replace(`
            regex,``
            `<span class="text-purple-400 font-semibold">${keyword}</span>`
          );
        });
      }

      // Highlight strings
      highlighted = highlighted.replace(
        /(["'])(.*?)\1/g,
        '<span class="text-green-400">$1$2$1</span>'
      );

      // Highlight comments
      highlighted = highlighted.replace(
        /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
        '<span class="text-gray-500 italic">$1</span>'
      );

      // Highlight numbers
      highlighted = highlighted.replace(
        /\b\d+\.?\d*\b/g,
        '<span class="text-yellow-400">// Highlight numbers
      highlighted = highlighted.replace(
        /\b\d+\.?\d*\b/g,
        '<span class="text-yellow-400">/\b\d+\.?\d*\b/g,
        '<span class="text-yellow-400">/\b\d+\.?\d*\b/g,
        '<span class="text-yellow-400">          );</span>'
      );</span>'
      );</span>'
      );

      return (
    <div className='group relative'>
      <div className='overflow-hidden rounded-lg border border-gray-700 bg-gray-900'>
        {title && (
          <div className='flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2'>
            <div className='flex items-center space-x-2'>
              <div className='h-3 w-3 rounded-full bg-red-500'></div>
              <div className='h-3 w-3 rounded-full bg-yellow-500'></div>
              <div className='h-3 w-3 rounded-full bg-green-500'></div>
              <span className='ml-4 text-sm text-gray-400'>{title}</span>
            </div>
            <button
              onClick={copyToClipboard}
              className='text-gray-400 opacity-0 transition-colors hover:text-white group-hover:opacity-100'
              title='Copy code'
            >
              {copied ? (
                <Check className='h-4 w-4' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </button>
          </div>
        )}
        <div className='overflow-x-auto p-4'>
          <pre className='text-sm'>
            <code
              className='text-gray-300'
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;</span>'
      );

      return highlighted;
    };
    setHighlightedCode(highlight(code, language));
  }, [code, language]);

  return (
    <div className='group relative'>
      <div className='overflow-hidden rounded-lg border border-gray-700 bg-gray-900'>
        {title && (
          <div className='flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2'>
            <div className='flex items-center space-x-2'>
              <div className='h-3 w-3 rounded-full bg-red-500'></div>
              <div className='h-3 w-3 rounded-full bg-yellow-500'></div>
              <div className='h-3 w-3 rounded-full bg-green-500'></div>
              <span className='ml-4 text-sm text-gray-400'>{title}</span>
            </div>
            <button
              onClick={copyToClipboard}
              className='text-gray-400 opacity-0 transition-colors hover:text-white group-hover:opacity-100'
              title='Copy code'
            >
              {copied ? (
                <Check className='h-4 w-4' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </button>
          </div>
        )}
        <div className='overflow-x-auto p-4'>
          <pre className='text-sm'>
            <code
              className='text-gray-300'
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
};
export default CodeBlock;