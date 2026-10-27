import { useSuspenseQuery } from '@tanstack/react-query';

async function fetchPokedex(url) {
  const res = await fetch(url);
  return res.json();
}

export default function useThisPokedex(url) {
  return useSuspenseQuery({
    queryKey: ['thisPokedex', url],
    queryFn: () => fetchPokedex(url),
  });
}
