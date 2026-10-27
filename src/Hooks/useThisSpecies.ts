import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { fetchJson } from '../Utils/fetchJson';
import type { PokemonSpecies } from '../types/pokeapi';

export const speciesQueryOptions = (url: string) =>
  queryOptions({
    queryKey: ['thisSpecies', url],
    queryFn: () => fetchJson<PokemonSpecies>(url),
  });

export default function useThisSpecies(url: string) {
  return useSuspenseQuery(speciesQueryOptions(url));
}
