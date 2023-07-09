import { useEffect, useRef } from 'react';

/**
 * Custom hook that returns a boolean value indicating whether it is the first render or not.
 * @returns {boolean} - Boolean value indicating whether it is the first render.
 */
export function useIsFirstRender(): boolean {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
}
