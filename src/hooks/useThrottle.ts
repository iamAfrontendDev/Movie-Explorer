import { useRef } from "react";

export function useThrottle<T extends (...args: any[]) => void>(
  fn: T,
  delay: number = 300,
) {
  const lastTimeRef = useRef<number>(0);

  const fnRef = useRef(fn);
  fnRef.current = fn;

  const throttledFnRef = useRef<((...args: Parameters<T>) => void) | null>(
    null,
  );

  if (!throttledFnRef.current) {
    throttledFnRef.current = (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastTimeRef.current >= delay) {
        lastTimeRef.current = now;
        fnRef.current(...args);
      }
    };
  }

  return throttledFnRef.current;
}
