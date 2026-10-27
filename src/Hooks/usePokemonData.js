import { useQuery } from '@tanstack/react-query';

async function fetchPokemon() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
  return res.json();
}

async function fetchAllPokemon(count) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${count}`);
  return res.json();
}
export default function usePokemonData() {
  const { data: countData } = useQuery({
    queryKey: ['pokemon'],
    queryFn: fetchPokemon,
  });

  const count = countData?.count;

  const {
    fetchStatus,
    isPending,
    data: allData,
  } = useQuery({
    queryKey: ['allPokemon', count],
    queryFn: () => fetchAllPokemon(count),
    enabled: count > 0,
  });

  return {
    isIdle: isPending && fetchStatus === 'idle',
    allData,
  };
}
