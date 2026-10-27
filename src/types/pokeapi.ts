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
  region: NamedAPIResource | null;
  pokemon_entries: {
    entry_number: number;
    pokemon_species: NamedAPIResource;
  }[];
  version_groups: NamedAPIResource[];
}

export interface FlavorTextEntry {
  // items call this field `text`
  flavor_text?: string;
  text?: string;
  language: NamedAPIResource;
  version?: NamedAPIResource;
  version_group?: NamedAPIResource;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number | null;
  hatch_counter: number | null;
  has_gender_differences: boolean;
  color: NamedAPIResource | null;
  shape: NamedAPIResource | null;
  habitat: NamedAPIResource | null;
  growth_rate: NamedAPIResource;
  generation: NamedAPIResource;
  egg_groups: NamedAPIResource[];
  evolves_from_species: NamedAPIResource | null;
  evolution_chain: { url: string };
  genera: { genus: string; language: NamedAPIResource }[];
  flavor_text_entries: FlavorTextEntry[];
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

type SpriteSet = {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
};

// Nested per generation and game; the leaves are image URLs or null
export type SpriteTree = { [key: string]: string | null | SpriteTree };

export interface Sprites extends SpriteSet {
  other?: {
    'official-artwork'?: {
      front_default: string | null;
      front_shiny: string | null;
    };
    home?: SpriteSet;
    showdown?: SpriteSet;
    dream_world?: { front_default: string | null; front_female: string | null };
  };
  versions?: Record<string, Record<string, SpriteTree>>;
}

export interface Pokemon {
  id: number;
  name: string;
  is_default: boolean;
  base_experience: number | null;
  height: number;
  weight: number;
  species: NamedAPIResource;
  cries: { latest: string | null; legacy: string | null };
  sprites: Sprites;
  types: { slot: number; type: NamedAPIResource }[];
  // a Pokémon's earlier types: valid up to and including `generation`
  past_types?: {
    generation: NamedAPIResource;
    types: { slot: number; type: NamedAPIResource }[];
  }[];
  stats: { base_stat: number; effort: number; stat: NamedAPIResource }[];
  abilities: {
    is_hidden: boolean;
    slot: number;
    ability: NamedAPIResource;
  }[];
  held_items: {
    item: NamedAPIResource;
    version_details: { rarity: number; version: NamedAPIResource }[];
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
  id: number;
  name: string;
  type: NamedAPIResource;
  target: NamedAPIResource;
  damage_class: NamedAPIResource;
  generation: NamedAPIResource;
  accuracy: number | null;
  pp: number | null;
  power: number | null;
  priority: number;
  effect_chance: number | null;
  effect_entries: {
    effect: string;
    short_effect: string;
    language: NamedAPIResource;
  }[];
  flavor_text_entries: FlavorTextEntry[];
  learned_by_pokemon: NamedAPIResource[];
  // PokeAPI returns null for some newer moves (e.g. Tera Blast)
  meta: MoveMeta | null;
}

export interface Ability {
  id: number;
  name: string;
  generation: NamedAPIResource;
  effect_entries: {
    effect: string;
    short_effect: string;
    language: NamedAPIResource;
  }[];
  flavor_text_entries: FlavorTextEntry[];
  pokemon: {
    is_hidden: boolean;
    slot: number;
    pokemon: NamedAPIResource;
  }[];
}

export interface Item {
  id: number;
  name: string;
  category: NamedAPIResource;
  fling_power: number | null;
  attributes: NamedAPIResource[];
  sprites: { default: string | null };
  effect_entries: {
    effect: string;
    short_effect: string;
    language: NamedAPIResource;
  }[];
  flavor_text_entries: FlavorTextEntry[];
  held_by_pokemon: { pokemon: NamedAPIResource }[];
}

export interface ItemCategory {
  name: string;
  pocket: NamedAPIResource;
  items: NamedAPIResource[];
}

export interface Type {
  id: number;
  name: string;
  damage_relations: Record<string, NamedAPIResource[]>;
  // how the chart looked in earlier games: valid up to and including `generation`
  past_damage_relations?: {
    generation: NamedAPIResource;
    damage_relations: Record<string, NamedAPIResource[]>;
  }[];
  pokemon: { slot: number; pokemon: NamedAPIResource }[];
  moves: NamedAPIResource[];
}

export interface DamageClass {
  name: string;
  moves: NamedAPIResource[];
}

export interface VersionGroup {
  name: string;
  order: number;
  generation: NamedAPIResource;
  versions: NamedAPIResource[];
  pokedexes: NamedAPIResource[];
}

export interface EncounterDetail {
  min_level: number;
  max_level: number;
  chance: number;
  method: NamedAPIResource;
  condition_values: NamedAPIResource[];
}

export interface LocationAreaEncounter {
  location_area: NamedAPIResource;
  version_details: {
    version: NamedAPIResource;
    max_chance: number;
    encounter_details: EncounterDetail[];
  }[];
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
