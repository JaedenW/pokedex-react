import React from 'react';
import { useLocation } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { prefetchPokemonCard } from '../Utils/prefetchPokemonCard';
import { useLoadMoreOnVisible } from '../Hooks/useLoadMoreOnVisible';
import PokemonCard, { type GridEntry } from './PokemonCard';
import PokemonCardSkeleton from './PokemonCardSkeleton';
import PokemonTile from './PokemonTile';
import { EmptyState } from './ui';

const BATCH_SIZE = { cards: 24, compact: 60 };
// Lets the visible batch start its requests before the next batch is warmed
const PREFETCH_DELAY_MS = 600;

// How far each history entry had loaded, so Back shows the same list again
const loadedByEntry = new Map<string, number>();

interface PokemonGridProps {
  entries: GridEntry[];
  view?: 'cards' | 'compact';
  /** Changing this starts the list again from the first batch */
  resetKey: string;
  emptyTitle?: string;
  emptyHint?: React.ReactNode;
}

export default function PokemonGrid({
  entries,
  view = 'cards',
  resetKey,
  emptyTitle = 'No Pokémon match',
  emptyHint,
}: PokemonGridProps) {
  const queryClient = useQueryClient();
  const { key } = useLocation();
  const batch = BATCH_SIZE[view];

  const [visibleCount, setVisibleCount] = React.useState(
    () => loadedByEntry.get(key) ?? batch
  );
  const [previousKey, setPreviousKey] = React.useState(resetKey);
  if (resetKey !== previousKey) {
    // a new dex, search or filter starts again from the first batch, but
    // marking a Pokémon as caught inside a filtered list must not jump back
    setPreviousKey(resetKey);
    setVisibleCount(batch);
  }

  React.useEffect(() => {
    loadedByEntry.set(key, visibleCount);
  }, [key, visibleCount]);

  const hasMore = visibleCount < entries.length;
  const loadMore = React.useCallback(
    () => setVisibleCount((count) => count + batch),
    [batch]
  );
  const sentinelRef = useLoadMoreOnVisible(loadMore, hasMore, visibleCount);

  React.useEffect(() => {
    if (view !== 'cards') return;
    const timer = setTimeout(() => {
      entries
        .slice(visibleCount, visibleCount + batch)
        .forEach(({ species }) =>
          prefetchPokemonCard(queryClient, species.url)
        );
    }, PREFETCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [entries, visibleCount, queryClient, view, batch]);

  if (!entries.length) {
    return <EmptyState title={emptyTitle}>{emptyHint}</EmptyState>;
  }

  const visible = entries.slice(0, visibleCount);

  return (
    <div>
      {view === 'cards' ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((entry) => (
            <React.Suspense
              key={entry.species.name}
              fallback={<PokemonCardSkeleton />}
            >
              <PokemonCard {...entry} />
            </React.Suspense>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-3">
          {visible.map((entry) => (
            <PokemonTile key={entry.species.name} {...entry} />
          ))}
        </div>
      )}
      {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-0" />}
    </div>
  );
}
