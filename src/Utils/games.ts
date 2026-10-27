import type { NamedAPIResource } from '../types/pokeapi';

// The newest main-series game that has full data; used when no game is chosen
export const DEFAULT_GAME = 'scarlet-violet';

/** "generation-viii" -> 8 */
export function generationNumber(name: string) {
  const numeral = name.split('-')[1]?.toUpperCase() ?? '';
  const values: Record<string, number> = { I: 1, V: 5, X: 10 };
  let total = 0;
  for (let i = 0; i < numeral.length; i++) {
    const value = values[numeral[i]] ?? 0;
    const next = values[numeral[i + 1]] ?? 0;
    total += value < next ? -value : value;
  }
  return total;
}

export const resourceNames = (resources: NamedAPIResource[]) =>
  resources.map((resource) => resource.name);
