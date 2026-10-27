import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchJson } from '../Utils/fetchJson';
import type { Pokedex } from '../types/pokeapi';

export default function useThisPokedex(url: string) {
  return useSuspenseQuery({
    queryKey: ['thisPokedex', url],
    queryFn: () => fetchJson<Pokedex>(url),
  });
}
