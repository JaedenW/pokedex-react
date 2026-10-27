import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchJson } from '../Utils/fetchJson';
import type { Pokemon } from '../types/pokeapi';

export default function useThisPokemon(url: string) {
  return useSuspenseQuery({
    queryKey: ['thisPokemon', url],
    queryFn: () => fetchJson<Pokemon>(url),
  });
}
