import { useQuery } from 'react-query';

async function fetchMove(url) {
  const res = await fetch(url);
  return res.json();
}

export default function useThisMove(url) {
  return useQuery(['move', url], () => fetchMove(url));
}
