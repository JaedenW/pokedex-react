import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePokedex } from '../Utils/PokedexContext';
import { prefetchPokemonCard } from '../Utils/prefetchPokemonCard';
import { useLoadMoreOnVisible } from '../Hooks/useLoadMoreOnVisible';
import ProgressIndicator from './ProgressIndicator';
import useThisPokedex from '../Hooks/useThisPokedex';
import PokemonCard from './PokemonCard';
import PokemonCardSkeleton from './PokemonCardSkeleton';

const BATCH_SIZE = 24;
// Lets the visible batch start its requests before the next batch is warmed
const PREFETCH_DELAY_MS = 600;

interface PokemonGridProps {
  search?: string;
  filterArray?: string[];
}

function PokemonGrid({ search, filterArray }: PokemonGridProps) {
  const { currentPokedex } = usePokedex();
  const queryClient = useQueryClient();
  const { data: pokedexData } = useThisPokedex(currentPokedex.url);

  // Keeps typing responsive while a long list is re-filtered
  const deferredSearch = React.useDeferredValue(search);
  const isFiltering = search !== deferredSearch;

  const matches = React.useMemo(() => {
    const species = pokedexData.pokemon_entries.map(
      (entry) => entry.pokemon_species
    );
    if (deferredSearch) {
      const query = deferredSearch.toLowerCase();
      return species.filter((s) => s.name.includes(query));
    }
    if (filterArray) {
      const allowed = new Set(filterArray);
      return species.filter((s) => allowed.has(s.name));
    }
    return species;
  }, [pokedexData, deferredSearch, filterArray]);

  const [visibleCount, setVisibleCount] = React.useState(BATCH_SIZE);
  const [previousMatches, setPreviousMatches] = React.useState(matches);
  if (matches !== previousMatches) {
    // a new dex, search or filter starts again from the first batch
    setPreviousMatches(matches);
    setVisibleCount(BATCH_SIZE);
  }

  const hasMore = visibleCount < matches.length;
  const loadMore = React.useCallback(
    () => setVisibleCount((count) => count + BATCH_SIZE),
    []
  );
  const sentinelRef = useLoadMoreOnVisible(loadMore, hasMore, visibleCount);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      matches
        .slice(visibleCount, visibleCount + BATCH_SIZE)
        .forEach((species) => prefetchPokemonCard(queryClient, species.url));
    }, PREFETCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [matches, visibleCount, queryClient]);

  return (
    <div className="container mx-auto mt-12 mb-32">
      {isFiltering && <ProgressIndicator />}
      <div className="flex flex-wrap place-content-center lg:px-5">
        {matches.slice(0, visibleCount).map((species) => (
          <React.Suspense key={species.name} fallback={<PokemonCardSkeleton />}>
            <PokemonCard species={species} />
          </React.Suspense>
        ))}
      </div>
      {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-0" />}
    </div>
  );
}

export default PokemonGrid;
