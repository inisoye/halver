import * as React from 'react';

/**
 * Debounces a value by delaying its update until a specified delay has passed.
 * @param value The value to be debounced.
 * @param delay The delay duration in milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
