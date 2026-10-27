import type { PokemonSpecies } from '../types/pokeapi';

export function getDefaultVariety(species: PokemonSpecies) {
  return (
    species.varieties.find((variety) => variety.is_default) ??
    species.varieties[0]
  );
}

/** The highest id that is a species' own default form; later ids are forms. */
export const MAX_SPECIES_ID = 10000;
