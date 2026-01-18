import { useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export function useInfiniteScroll({ 
  hasMore, 
  loadingMore, 
  onLoadMore, 
  threshold = 0.1 
}: UseInfiniteScrollProps) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: false,
    rootMargin: '100px'
  });

  const loadMoreCallback = useCallback(() => {
    if (inView && hasMore && !loadingMore) {
      onLoadMore();
    }
  }, [inView, hasMore, loadingMore, onLoadMore]);

  useEffect(() => {
    loadMoreCallback();
  }, [loadMoreCallback]);

  return { ref };
}
