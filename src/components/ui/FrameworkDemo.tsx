import type { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface FrameworkDemoProps {
  title: string;
  framework: string;
  children: ReactNode;
  fallbackMessage?: string;
}

const FrameworkFallback = ({
  framework,
  title,
  error,
}: {
  framework: string;
  title: string;
  error?: string;
}) => (
  <div className='rounded-lg border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20'>
    <div className='mb-3 flex items-center'>
      <div className='mr-3 h-3 w-3 rounded-full bg-blue-500'></div>
      <h3 className='text-lg font-bold text-blue-800 dark:text-blue-200'>
        {framework} Demo: {title}
      </h3>
    </div>

    <div className='mb-4 text-blue-700 dark:text-blue-300'>
      <p className='mb-2'>
        This {framework} component is temporarily unavailable.
      </p>
      {error && (
        <details className='text-sm'>
          <summary className='cursor-pointer'>Error Details</summary>
          <code className='mt-2 block rounded bg-blue-100 p-2 dark:bg-blue-800'>
            {error}
          </code>
        </details>
      )}
    </div>

    <div className='flex gap-2'>
      <span className='rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-800 dark:text-blue-200'>
        {framework}
      </span>
      <span className='rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300'>
        Fallback Active
      </span>
    </div>
  </div>
);

export const FrameworkDemo = ({
  title,
  framework,
  children,
  fallbackMessage,
}: FrameworkDemoProps) => {
  return (
    <div className='framework-demo-container mb-8'>
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
        <div className='overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800'>
          <div className='bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white'>
            <h3 className='text-xl font-bold'>{title}</h3>
            <p className='text-sm text-blue-100'>Framework: {framework}</p>
          </div>
          <div className='p-6'>{children}</div>
        </div>
      </ErrorBoundary>
    </div>
  );
};
export default FrameworkDemo;
