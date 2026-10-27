import { useLocation } from 'react-router';

export const DEFAULT_DEX = 'national';

const DEX_PATH = /^\/dex\/([^/]+)/;

/**
 * The Pokédex being browsed. It comes from the URL, either /dex/:name or a
 * ?dex= parameter on a Pokémon page, so nothing needs to be stored.
 */
export function useDexName() {
  const { pathname, search } = useLocation();
  return (
    DEX_PATH.exec(pathname)?.[1] ??
    new URLSearchParams(search).get('dex') ??
    DEFAULT_DEX
  );
}

/** A link to a Pokémon that remembers which Pokédex you came from. */
export function pokemonHref(name: string, dex: string) {
  return dex === DEFAULT_DEX
    ? `/pokemon/${name}`
    : `/pokemon/${name}?dex=${dex}`;
}

export function usePokemonHref() {
  const dex = useDexName();
  return (name: string) => pokemonHref(name, dex);
}

export const dexHref = (dex: string) => `/dex/${dex}`;
