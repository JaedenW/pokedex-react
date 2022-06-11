import { useQuery } from 'react-query';

async function fetchPokedex(url) {
  const res = await fetch(url);
  return res.json();
}

export default function useThisPokedex(url) {
  return useQuery(['thisPokedex', url], () => fetchPokedex(url));
}
