import { useQuery } from 'react-query';

async function fetchThisPokemon(url) {
  const res = await fetch(url);
  return res.json();
}

export default function useThisPokemon(url) {
  return useQuery(['thisPokemon', url], () => fetchThisPokemon(url), {});
}
