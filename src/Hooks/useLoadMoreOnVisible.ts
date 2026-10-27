import { useEffect, useEffectEvent, useRef } from 'react';

/**
 * Calls `onLoadMore` whenever the returned sentinel ref is within one screen
 * of the bottom of the nearest `[data-scroll-root]` ancestor, so the next
 * batch is requested before the user gets there.
 *
 * `loadedCount` re-arms the observer after each batch: an IntersectionObserver
 * only reports changes, so without this a sentinel that is still in range
 * after a batch loads would never trigger the next one.
 */
export function useLoadMoreOnVisible(
  onLoadMore: () => void,
  enabled: boolean,
  loadedCount: number
) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMore = useEffectEvent(onLoadMore);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!enabled || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      {
        root: sentinel.closest('[data-scroll-root]'),
        rootMargin: '0px 0px 100% 0px',
      }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enabled, loadedCount]);

  return sentinelRef;
}
