import { useQuery } from 'react-query';

async function fetchEvolutionChain(url) {
  const res = await fetch(url);
  return res.json();
}

export default function useEvolutionChain(url) {
  return useQuery(['thisPokemon', url], () => fetchEvolutionChain(url));
}
