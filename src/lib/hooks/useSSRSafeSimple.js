import { useEffect, useState } from 'react';

/**
 * Simplified SSR-safe hook
 * Just handles the basic mount detection
 */
export function useSSRSafeSimple() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return {
    isMounted,
    isClient: typeof window !== 'undefined',
    isSSR: !isMounted,
  };
}
