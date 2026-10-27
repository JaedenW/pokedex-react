import { useSuspenseQuery } from '@tanstack/react-query';

async function fetchThisPokemon(url) {
  const res = await fetch(url);
  return res.json();
}

export default function useThisPokemon(url) {
  return useSuspenseQuery({
    queryKey: ['thisPokemon', url],
    queryFn: () => fetchThisPokemon(url),
  });
}
