import React from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface FrameworkDemoProps {
  title: string;
  framework: string;
  children: React.ReactNode;
  fallbackMessage?: string;
}

const FrameworkFallback = ({ framework, title, error }: { 
  framework: string; 
  title: string; 
  error?: string;
}) => (
  <div className="p-6 border-2 border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
    <div className="flex items-center mb-3">
      <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
      <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200">
        {framework} Demo: {title}
      </h3>
    </div>
    
    <div className="text-blue-700 dark:text-blue-300 mb-4">
      <p className="mb-2">This {framework} component is temporarily unavailable.</p>
      {error && (
        <details className="text-sm">
          <summary className="cursor-pointer">Error Details</summary>
          <code className="block mt-2 p-2 bg-blue-100 dark:bg-blue-800 rounded">
            {error}
          </code>
        </details>
      )}
    </div>
    
    <div className="flex gap-2">
      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm">
        {framework}
      </span>
      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
        Fallback Active
      </span>
    </div>
  </div>
);

export const FrameworkDemo: React.FC<FrameworkDemoProps> = ({
  title,
  framework,
  children,
  fallbackMessage
}) => {
  return (
    <div className="framework-demo-container mb-8">
      <ErrorBoundary
        fallback={
          <FrameworkFallback 
            framework={framework} 
            title={title}
            error={fallbackMessage}
          />
        }
        onError={(error, errorInfo) => {
          console.error(`${framework} Component Error in ${title}:`, error);
          console.error('Error Info:', errorInfo);
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-blue-100 text-sm">Framework: {framework}</p>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default FrameworkDemo;
