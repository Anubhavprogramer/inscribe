import { useEffect, useRef } from 'react';

export function useAutosave(callback, delay = 2000, deps = []) {
  const savedCallback = useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    if (delay === null) {
      return;
    }

    const handler = setTimeout(() => {
      savedCallback.current();
    }, delay);

    return () => clearTimeout(handler);
  }, [delay, ...deps]);
}
