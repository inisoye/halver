import { useEffect, useRef, useState } from 'react';

/**
 * Throttles the given value based on the specified interval.
 *
 * @template T - The type of the value.
 * @param value - The value to be throttled.
 * @param interval - The interval (in milliseconds) to throttle the value. Default is 500 milliseconds.
 * @returns The throttled value.
 */
export function useThrottle<T>(value: T, interval = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>();

  useEffect(() => {
    const now = Date.now();

    if (now >= (lastUpdated.current || 0) + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const id = window.setTimeout(() => {
        lastUpdated.current = now;
        setThrottledValue(value);
      }, interval);

      return () => window.clearTimeout(id);
    }
  }, [value, interval]);

  return throttledValue;
}
