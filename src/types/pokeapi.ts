// The subset of PokeAPI v2 responses this app reads.
// https://pokeapi.co/docs/v2

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface NamedAPIResourceList {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface Region {
  name: string;
  pokedexes: NamedAPIResource[];
}

export interface Pokedex {
  name: string;
  pokemon_entries: {
    entry_number: number;
    pokemon_species: NamedAPIResource;
  }[];
  version_groups: NamedAPIResource[];
}

export interface PokemonSpecies {
  name: string;
  is_legendary: boolean;
  is_mythical: boolean;
  evolution_chain: { url: string };
  pokedex_numbers: {
    entry_number: number;
    pokedex: NamedAPIResource;
  }[];
  varieties: {
    is_default: boolean;
    pokemon: NamedAPIResource;
  }[];
}

export interface VersionGroupDetail {
  level_learned_at: number;
  move_learn_method: NamedAPIResource;
  version_group: NamedAPIResource;
}

export interface Pokemon {
  name: string;
  base_experience: number | null;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: { front_default: string | null };
    };
  };
  types: { slot: number; type: NamedAPIResource }[];
  stats: { base_stat: number; stat: NamedAPIResource }[];
  abilities: {
    is_hidden: boolean;
    ability: NamedAPIResource;
  }[];
  moves: {
    move: NamedAPIResource;
    version_group_details: VersionGroupDetail[];
  }[];
}

export interface MoveMeta {
  ailment: NamedAPIResource;
  category: NamedAPIResource;
  min_hits: number | null;
  max_hits: number | null;
  min_turns: number | null;
  max_turns: number | null;
  drain: number;
  healing: number;
  crit_rate: number;
  ailment_chance: number;
  flinch_chance: number;
  stat_chance: number;
}

export interface Move {
  name: string;
  type: NamedAPIResource;
  target: NamedAPIResource;
  pp: number | null;
  power: number | null;
  // PokeAPI returns null for some newer moves (e.g. Tera Blast)
  meta: MoveMeta | null;
}

export interface Ability {
  effect_entries: {
    effect: string;
    short_effect: string;
    language: NamedAPIResource;
  }[];
}

export interface Type {
  damage_relations: Record<string, NamedAPIResource[]>;
  pokemon: { slot: number; pokemon: NamedAPIResource }[];
}

// Evolution requirements: each key is a condition (min_level, item, ...)
// whose value is empty, a primitive or a named resource.
export type EvolutionDetail = Record<
  string,
  string | number | boolean | NamedAPIResource | null
>;

export interface ChainLink {
  species: NamedAPIResource;
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
}

export interface EvolutionChain {
  chain: ChainLink;
}
