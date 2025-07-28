import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook for SSR-safe client-only operations
 * Ensures components only run browser-specific code after hydration
 */
export function useSSRSafe() {
  const [isMounted, setIsMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Double-check we're in a browser environment
    setIsClient(typeof window !== 'undefined');
  }, []);

  const safeWindowAccess = useCallback(
    (callback, fallback = null) => {
      if (isClient && isMounted) {
        return callback(window);
      }
      return fallback;
    },
    [isClient, isMounted]
  );

  const safeDocumentAccess = useCallback(
    (callback, fallback = null) => {
      if (isClient && isMounted && typeof document !== 'undefined') {
        return callback(document);
      }
      return fallback;
    },
    [isClient, isMounted]
  );

  const safeNavigatorAccess = useCallback(
    (callback, fallback = null) => {
      if (isClient && isMounted && typeof navigator !== 'undefined') {
        return callback(navigator);
      }
      return fallback;
    },
    [isClient, isMounted]
  );

  const safePerformanceAccess = useCallback(
    (callback, fallback = null) => {
      if (isClient && isMounted && typeof performance !== 'undefined') {
        return callback(performance);
      }
      return fallback;
    },
    [isClient, isMounted]
  );

  const addEventListener = useCallback(
    (element, event, handler, options = {}) => {
      if (!isClient || !isMounted) return () => {};

      const target = element || (typeof window !== 'undefined' ? window : null);
      if (!target || !target.addEventListener) return () => {};

      target.addEventListener(event, handler, options);

      return () => {
        if (target && target.removeEventListener) {
          target.removeEventListener(event, handler, options);
        }
      };
    },
    [isClient, isMounted]
  );

  return {
    isMounted,
    isClient,
    isSSR: !isMounted || !isClient,
    safeWindowAccess,
    safeDocumentAccess,
    safeNavigatorAccess,
    safePerformanceAccess,
    addEventListener,
  };
}
