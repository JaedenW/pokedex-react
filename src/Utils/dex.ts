import { getDisplayName } from './text';

export const DEFAULT_DEX = 'national';

export const pokemonHref = (name: string) => `/pokemon/${name}`;

export const dexHref = (dex: string) => `/dex/${dex}`;

export const dexLabel = (dex: string) =>
  dex === DEFAULT_DEX ? 'National' : getDisplayName(dex);
