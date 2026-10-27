import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchJson } from '../Utils/fetchJson';
import type { Region } from '../types/pokeapi';

export default function useThisRegion(url: string) {
  return useSuspenseQuery({
    queryKey: ['thisRegion', url],
    queryFn: () => fetchJson<Region>(url),
  });
}
