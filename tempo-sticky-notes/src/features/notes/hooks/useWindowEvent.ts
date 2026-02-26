import { useEffect } from 'react';

export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (ev: WindowEventMap[K]) => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener(type, handler);
    return () => window.removeEventListener(type, handler);
  }, [type, handler, enabled]);
}