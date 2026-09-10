import { useEffect } from "react";

export function useInfiniteScroll(
  sentinalRef: React.RefObject<HTMLDivElement | null>,
  onIntersect: () => void,
  options?: IntersectionObserverInit,
) {
  useEffect(() => {
    if (sentinalRef.current === null) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onIntersect();
      }
    }, options);

    observer.observe(sentinalRef.current);

    return () => observer.disconnect();
  }, [sentinalRef, onIntersect]);
}
