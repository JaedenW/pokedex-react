import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { fetchJson } from '../Utils/fetchJson';
import type { Pokemon } from '../types/pokeapi';

export const pokemonQueryOptions = (url: string) =>
  queryOptions({
    queryKey: ['thisPokemon', url],
    queryFn: () => fetchJson<Pokemon>(url),
  });

export default function useThisPokemon(url: string) {
  return useSuspenseQuery(pokemonQueryOptions(url));
}
