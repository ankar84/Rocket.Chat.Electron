import { useEffect, useRef } from 'react';

export const usePrevious = <T>(current: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(
    () => () => {
      ref.current = current;
    },
    [current]
  );

  return ref.current;
};
