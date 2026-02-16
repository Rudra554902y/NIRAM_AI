import { useEffect, useRef } from 'react';

export const usePolling = (callback, interval = 30000) => {
  const savedCallback = useRef();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (interval !== null) {
      const id = setInterval(tick, interval);
      return () => clearInterval(id);
    }
  }, [interval]);
};

export default usePolling;
