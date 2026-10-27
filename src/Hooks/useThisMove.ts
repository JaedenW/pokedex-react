import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchJson } from '../Utils/fetchJson';
import type { Move } from '../types/pokeapi';

export default function useThisMove(url: string) {
  return useSuspenseQuery({
    queryKey: ['move', url],
    queryFn: () => fetchJson<Move>(url),
  });
}
