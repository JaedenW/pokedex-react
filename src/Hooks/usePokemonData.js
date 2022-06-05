import { useInfiniteQuery, useQuery } from 'react-query';

async function fetchPokemon({
  pageParam = 'https://pokeapi.co/api/v2/pokemon?limit=30',
}) {
  const res = await fetch(pageParam);
  return res.json();
}

async function fetchAllPokemon(count) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${count}`);
  return res.json();
}

export default function usePokemonData(isSearching) {
  const { data, status, fetchNextPage, hasNextPage } = useInfiniteQuery(
    'pokemon',
    fetchPokemon,
    {
      getNextPageParam: (lastPage) => lastPage.next,
    }
  );

  const count = data?.pages[0].count;

  const { isIdle, data: allData } = useQuery(
    ['allPokemon', count, isSearching],
    () => fetchAllPokemon(count),
    {
      enabled: isSearching,
    }
  );

  return {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isIdle,
    allData,
  };
}
