import {
  queryOptions,
  useQuery,
  useSuspenseQueries,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { fetchJson } from '../Utils/fetchJson';
import type {
  Ability,
  DamageClass,
  EvolutionChain,
  Item,
  ItemCategory,
  LocationAreaEncounter,
  Move,
  NamedAPIResourceList,
  Pokedex,
  Pokemon,
  PokemonSpecies,
  Region,
  Type,
  VersionGroup,
} from '../types/pokeapi';

export const API_BASE = 'https://pokeapi.co/api/v2';

export const apiUrl = (path: string) => `${API_BASE}/${path}`;

// "https://pokeapi.co/api/v2/pokemon-species/5/" -> "pokemon-species/5"
export const pathFromUrl = (url: string) =>
  url.replace(`${API_BASE}/`, '').replace(/\/$/, '');

// The trailing id of a resource URL (".../pokemon/25/" -> 25)
export const idFromUrl = (url: string) =>
  Number(url.split('/').filter(Boolean).at(-1));

export const apiQuery = <T>(path: string) =>
  queryOptions({
    queryKey: ['api', path],
    queryFn: () => fetchJson<T>(apiUrl(path)),
  });

/** Suspends until the resource has loaded; errors go to the error boundary. */
export function useApi<T>(path: string) {
  return useSuspenseQuery(apiQuery<T>(path)).data;
}

/** Like useApi, but only fetches when a path is given (e.g. a chosen filter). */
export function useOptionalApi<T>(path: string | null | undefined) {
  const queries: ReturnType<typeof apiQuery<T>>[] = path
    ? [apiQuery<T>(path)]
    : [];
  const [result] = useSuspenseQueries({ queries });
  return result?.data as T | undefined;
}

/** Non-suspending variant for data that shouldn't block the page. */
export function useApiQuery<T>(path: string, enabled = true) {
  return useQuery({ ...apiQuery<T>(path), enabled });
}

export const useSpecies = (name: string) =>
  useApi<PokemonSpecies>(`pokemon-species/${name}`);
export const usePokemon = (name: string) => useApi<Pokemon>(`pokemon/${name}`);
export const useMove = (name: string) => useApi<Move>(`move/${name}`);
export const useAbility = (name: string) => useApi<Ability>(`ability/${name}`);
export const useItem = (name: string) => useApi<Item>(`item/${name}`);
export const useTypeData = (name: string) => useApi<Type>(`type/${name}`);
export const usePokedexData = (name: string) =>
  useApi<Pokedex>(`pokedex/${name}`);
export const useRegionData = (name: string) => useApi<Region>(`region/${name}`);
export const useEvolutionChain = (path: string) => useApi<EvolutionChain>(path);
export const useEncounters = (pokemonId: number) =>
  useApi<LocationAreaEncounter[]>(`pokemon/${pokemonId}/encounters`);
export const useVersionGroups = () =>
  useApi<NamedAPIResourceList>('version-group?limit=50');
export const useVersionGroup = (name: string) =>
  useApi<VersionGroup>(`version-group/${name}`);
export const useItemCategory = (name: string) =>
  useApi<ItemCategory>(`item-category/${name}`);
export const useDamageClass = (name: string) =>
  useApi<DamageClass>(`move-damage-class/${name}`);

// Name indexes used by lists and search
export const speciesIndexPath = 'pokemon-species?limit=2000';
export const moveIndexPath = 'move?limit=2000';
export const abilityIndexPath = 'ability?limit=1000';
export const itemIndexPath = 'item?limit=3000';
export const itemCategoryIndexPath = 'item-category?limit=100';
