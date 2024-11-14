import { useRef } from 'react';

export const useClientOnce = (fn: () => void): void => {
  const canCall = useRef(true);
  if (typeof window !== 'undefined' && canCall.current) {
    canCall.current = false;
    fn();
  }
}
