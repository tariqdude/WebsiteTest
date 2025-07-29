import { useState, useEffect, type ReactNode } from 'react';

interface SSRSafeWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  loadingText?: string;
}

/**
 * SSR Safe Wrapper - Complete solution for browser API dependent components
 * Ensures components only render on client side with proper loading states
 */
export default function SSRSafeWrapper({
  children,
  fallback,
  className = '',
  loadingText = 'Loading...',
}: SSRSafeWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure we're fully client-side mounted
    setIsMounted(true);

    // Small delay to allow proper hydration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // During SSR or before mount, show fallback or loading
  if (!isMounted || isLoading) {
    return (
      <div
        className={`flex min-h-[200px] items-center justify-center ${className}`}
      >
        {fallback || (
          <div className='p-8 text-center'>
            <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
            <p className='text-gray-600 dark:text-gray-400'>{loadingText}</p>
          </div>
        )}
      </div>
    );
  }

  // Only render children when fully client-side
  return <div className={className}>{children}</div>;
}