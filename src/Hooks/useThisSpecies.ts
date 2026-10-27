import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchJson } from '../Utils/fetchJson';
import type { PokemonSpecies } from '../types/pokeapi';

export default function useThisSpecies(url: string) {
  return useSuspenseQuery({
    queryKey: ['thisSpecies', url],
    queryFn: () => fetchJson<PokemonSpecies>(url),
  });
}
