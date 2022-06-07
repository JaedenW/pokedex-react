import { useQuery } from 'react-query';

async function fetchPokemon() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
  return res.json();
}

async function fetchAllPokemon(count) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${count}`);
  return res.json();
}

export default function usePokemonData() {
  const { data: countData } = useQuery('pokemon', fetchPokemon, {});

  const count = countData?.count;

  const { isIdle, data: allData } = useQuery(
    ['allPokemon', count],
    () => fetchAllPokemon(count),
    {
      enabled: count > 0,
    }
  );

  return {
    isIdle,
    allData,
  };
}
