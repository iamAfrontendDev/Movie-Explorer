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
  }, 500);

  useEffect(() => {
    if (!bottomDivRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          throttledLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.5,
      },
    );

    observer.observe(bottomDivRef.current);

    return () => observer.disconnect();
  }, [bottomDivRef, throttledLoadMore]);
}
