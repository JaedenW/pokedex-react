import { useSuspenseQuery } from '@tanstack/react-query';

async function fetchRegion(url) {
  const res = await fetch(url);
  return res.json();
}

export default function useThisRegion(url) {
  return useSuspenseQuery({
    queryKey: ['thisRegion', url],
    queryFn: () => fetchRegion(url),
  });
}
