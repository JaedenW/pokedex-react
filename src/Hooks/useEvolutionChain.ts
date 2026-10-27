import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchJson } from '../Utils/fetchJson';
import type { EvolutionChain } from '../types/pokeapi';

export default function useEvolutionChain(url: string) {
  return useSuspenseQuery({
    queryKey: ['evolutionChain', url],
    queryFn: () => fetchJson<EvolutionChain>(url),
  });
}
