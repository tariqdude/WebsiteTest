import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Enhanced SSR-safe hook with advanced capabilities
 * Provides comprehensive client-side environment detection and utilities
 */
export function useSSRSafeSimple() {
  const [isMounted, setIsMounted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    isTouch: false,
    isMobile: false,
    isTablet: false,
    pixelRatio: 1,
    colorScheme: 'light',
  });

  const observersRef = useRef(new Set());
  const timersRef = useRef(new Set());

  // Enhanced environment detection
  useEffect(() => {
    setIsMounted(true);

    // Detect if fully hydrated
    const hydrationTimer = setTimeout(() => {
      setIsHydrated(true);

      // Enhanced device detection
      if (typeof window !== 'undefined') {
        const updateDeviceInfo = () => {
          setDeviceInfo({
            isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            isMobile: window.innerWidth < 768,
            isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
            pixelRatio: window.devicePixelRatio || 1,
            colorScheme: window.matchMedia?.('(prefers-color-scheme: dark)')
              .matches
              ? 'dark'
              : 'light',
          });
        };

        updateDeviceInfo();

        // Listen for changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const resizeHandler = () => updateDeviceInfo();

        mediaQuery.addListener?.(updateDeviceInfo);
        window.addEventListener('resize', resizeHandler, { passive: true });

        return () => {
          mediaQuery.removeListener?.(updateDeviceInfo);
          window.removeEventListener('resize', resizeHandler);
        };
      }
    }, 50);

    return () => clearTimeout(hydrationTimer);
  }, []);

  // Enhanced safe API access with automatic cleanup
  const safeExecute = useCallback(
    (callback, fallback = null) => {
      if (!isMounted || typeof window === 'undefined') return fallback;

      try {
        return callback();
      } catch (error) {
        console.warn('Safe execution failed:', error);
        return fallback;
      }
    },
    [isMounted]
  );

  // Advanced observer management
  const createObserver = useCallback(
    (type, callback, options = {}) => {
      return safeExecute(() => {
        let observer;

        switch (type) {
          case 'intersection':
            observer = new IntersectionObserver(callback, {
              threshold: [0, 0.25, 0.5, 0.75, 1],
              rootMargin: '10px',
              ...options,
            });
            break;
          case 'resize':
            observer = new ResizeObserver(callback);
            break;
          case 'mutation':
            observer = new MutationObserver(callback);
            break;
          default:
            return null;
        }

        if (observer) {
          observersRef.current.add(observer);
        }
        return observer;
      });
    },
    [safeExecute]
  );

  // Enhanced timer management
  const safeTimeout = useCallback(
    (callback, delay) => {
      const timer = setTimeout(() => {
        safeExecute(callback);
        timersRef.current.delete(timer);
      }, delay);

      timersRef.current.add(timer);
      return timer;
    },
    [safeExecute]
  );

  const safeInterval = useCallback(
    (callback, delay) => {
      const timer = setInterval(() => {
        safeExecute(callback);
      }, delay);

      timersRef.current.add(timer);
      return timer;
    },
    [safeExecute]
  );

  // Cleanup all resources
  useEffect(() => {
    return () => {
      // Cleanup observers
      observersRef.current.forEach((observer) => {
        observer.disconnect?.();
      });
      observersRef.current.clear();

      // Cleanup timers
      timersRef.current.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer);
      });
      timersRef.current.clear();
    };
  }, []);

  const isClient = typeof window !== 'undefined';

  return {
    // Basic state
    isMounted,
    isHydrated,
    isClient,
    isSSR: !isMounted,

    // Enhanced device info
    deviceInfo,

    // Safe execution utilities
    safeExecute,
    createObserver,
    safeTimeout,
    safeInterval,

    // Convenience getters
    get isReady() {
      return isMounted && isHydrated && isClient;
    },
    get isTouchDevice() {
      return deviceInfo.isTouch;
    },
    get isMobileDevice() {
      return deviceInfo.isMobile;
    },
    get isTabletDevice() {
      return deviceInfo.isTablet;
    },
    get isDesktopDevice() {
      return !deviceInfo.isMobile && !deviceInfo.isTablet;
    },
    get isDarkMode() {
      return deviceInfo.colorScheme === 'dark';
    },
    get isHighDPI() {
      return deviceInfo.pixelRatio > 1;
    },
  };
}
