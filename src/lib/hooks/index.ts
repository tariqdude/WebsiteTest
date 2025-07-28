import { useState, useEffect, useCallback } from 'react';
import type { RefObject } from 'react';
import type { ThemePreference } from '../validations';
import type { ExtendedPerformance } from '../types';

// Theme hook
export function useTheme() {
  const [theme, setTheme] = useState<ThemePreference>('system');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('theme') as ThemePreference;
    if (stored) {
      setTheme(stored);
    }
  }, []);

  const updateTheme = useCallback((newTheme: ThemePreference) => {
    if (typeof window === 'undefined') return;

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (
      newTheme === 'dark' ||
      (newTheme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return { theme, updateTheme };
}

// Local storage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (typeof window === 'undefined') return;

      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('Error setting localStorage:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}

// Intersection observer hook
export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, options]);

  return isVisible;
}

// Debounce hook
export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Performance metrics hook
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Web Vitals measurement
    const measurePerformance = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigation = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');

        const fcp =
          paint.find((entry) => entry.name === 'first-contentful-paint')
            ?.startTime || 0;
        const ttfb = navigation.responseStart - navigation.requestStart;
        const domLoad =
          navigation.domContentLoadedEventEnd - navigation.fetchStart;

        setMetrics({
          fcp: Math.round(fcp),
          ttfb: Math.round(ttfb),
          domLoad: Math.round(domLoad),
          memory:
            (performance as ExtendedPerformance).memory?.usedJSHeapSize || 0,
        });
      }
    };

    measurePerformance();

    // Measure again after page load
    if (document.readyState === 'loading') {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  return metrics;
}
