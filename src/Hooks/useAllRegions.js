import { useQuery } from 'react-query';

async function fetchAllRegions() {
  const res = await fetch('https://pokeapi.co/api/v2/region?limit=28');
  return res.json();
}

export default function useAllRegions() {
  return useQuery('allRegions', fetchAllRegions);
}
