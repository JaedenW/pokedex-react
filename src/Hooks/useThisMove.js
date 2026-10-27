import { useSuspenseQuery } from '@tanstack/react-query';

async function fetchMove(url) {
  const res = await fetch(url);
  return res.json();
}

export default function useThisMove(url) {
  return useSuspenseQuery({
    queryKey: ['move', url],
    queryFn: () => fetchMove(url),
  });
}
