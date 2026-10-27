import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchJson } from '../Utils/fetchJson';
import type { NamedAPIResourceList } from '../types/pokeapi';

export default function useAllRegions() {
  return useSuspenseQuery({
    queryKey: ['allRegions'],
    queryFn: () =>
      fetchJson<NamedAPIResourceList>(
        'https://pokeapi.co/api/v2/region?limit=100'
      ),
  });
}
