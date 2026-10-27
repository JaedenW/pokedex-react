import type { NamedAPIResource, Pokemon, PokemonSpecies } from './pokeapi';

export type PokemonData = Pokemon & { displayName: string };

// Router state passed along when navigating to a Pokemon or type page
export interface PokemonLocationState {
  pokemonData: PokemonData;
  speciesData: PokemonSpecies;
}

export interface TypeLocationState {
  type: NamedAPIResource;
}
