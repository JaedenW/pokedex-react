import React from 'react';
import { useLoadMoreOnVisible } from '../Hooks/useLoadMoreOnVisible';
import MoveRow, { MoveRowSkeleton } from './MoveRow';
import { EmptyState } from './ui';

export interface MoveListItem {
  name: string;
  /** When set, the level (or 0 for "evolve") is shown first */
  level?: number;
}

const BATCH = 30;

/** Moves rendered in batches as you scroll, each filling in as it loads. */
export default function MoveRowList({
  items,
  resetKey,
  emptyTitle = 'No moves found',
}: {
  items: MoveListItem[];
  resetKey: string;
  emptyTitle?: string;
}) {
  const [count, setCount] = React.useState(BATCH);
  const [previousKey, setPreviousKey] = React.useState(resetKey);
  if (resetKey !== previousKey) {
    setPreviousKey(resetKey);
    setCount(BATCH);
  }
  const hasMore = count < items.length;
  const sentinelRef = useLoadMoreOnVisible(
    React.useCallback(() => setCount((c) => c + BATCH), []),
    hasMore,
    count
  );

  if (!items.length) return <EmptyState title={emptyTitle} />;

  return (
    <>
      <ul className="space-y-2">
        {items.slice(0, count).map((item) => (
          <React.Suspense
            key={`${item.name}-${item.level ?? ''}`}
            fallback={<MoveRowSkeleton />}
          >
            <MoveRow name={item.name} level={item.level} />
          </React.Suspense>
        ))}
      </ul>
      {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-0" />}
    </>
  );
}
