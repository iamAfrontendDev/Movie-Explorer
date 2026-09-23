import { useCallback, useEffect, useState } from "react";

export function useInfiniteScroll(
  onIntersect: () => void,
  loadedCount: number,
  onLeave?: () => void,
  options?: IntersectionObserverInit,
) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  const sentinalRef = useCallback((el: HTMLDivElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (node === null) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onIntersect(); // sentinel came ON screen
      } else {
        onLeave?.(); // sentinel went OFF screen
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, onIntersect, onLeave, loadedCount]);

  return sentinalRef;
}