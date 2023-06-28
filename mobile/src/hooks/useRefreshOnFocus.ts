import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

type AsyncFunction<T> = () => Promise<T>;
type SyncFunction<T> = () => T | Promise<T>;
type VoidFunction = () => void | Promise<void>;
type AnyFunction<T> = AsyncFunction<T> | SyncFunction<T> | VoidFunction;

export function useRefreshOnFocus<T>(functionToRefresh: AnyFunction<T>) {
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      functionToRefresh();
    }, [functionToRefresh]),
  );
}
