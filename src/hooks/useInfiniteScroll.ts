import { useEffect } from "react";
import { useThrottle } from "./useThrottle";

interface InfiniteScrollProps {
  loadingRef: React.MutableRefObject<boolean>;
  hasMoreRef: React.MutableRefObject<boolean>;
  loadMovies: (page: number) => void;
  pageRef: React.MutableRefObject<number>;
  bottomDivRef: React.RefObject<HTMLDivElement | null>;
}

export function useInfiniteScroll({
  loadingRef,
  hasMoreRef,
  loadMovies,
  pageRef,
  bottomDivRef,
}: InfiniteScrollProps) {
  const throttledLoadMore = useThrottle(() => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadMovies(pageRef.current);
    pageRef.current += 1;
  }, 300);

  useEffect(() => {
    if (!bottomDivRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          throttledLoadMore();
        }
      },
      { root: null, rootMargin: "300px", threshold: 0 },
    );

    observer.observe(bottomDivRef.current);
    return () => observer.disconnect();
  }, [bottomDivRef, throttledLoadMore, loadingRef, hasMoreRef]);
}
