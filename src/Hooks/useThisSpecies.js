import { useSuspenseQuery } from '@tanstack/react-query';

async function fetchSpecies(url) {
  const res = await fetch(url);
  return res.json();
}

export default function useThisSpecies(url) {
  return useSuspenseQuery({
    queryKey: ['thisPokemon', url],
    queryFn: () => fetchSpecies(url),
  });
}
