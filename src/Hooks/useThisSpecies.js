import { useQuery } from 'react-query';

async function fetchSpecies(url) {
  const res = await fetch(url);
  return res.json();
}

export default function useThisSpecies(url) {
  return useQuery(['thisPokemon', url], () => fetchSpecies(url));
}
