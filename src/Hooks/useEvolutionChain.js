import { useSuspenseQuery } from '@tanstack/react-query';

async function fetchEvolutionChain(url) {
  const res = await fetch(url);
  return res.json();
}

export default function useEvolutionChain(url) {
  return useSuspenseQuery({
    queryKey: ['thisPokemon', url],
    queryFn: () => fetchEvolutionChain(url),
  });
}
