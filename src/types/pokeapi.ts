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

export interface LocalName {
  name: string;
  language: NamedAPIResource;
}

export interface Region {
  name: string;
  names: LocalName[];
  pokedexes: NamedAPIResource[];
  locations: NamedAPIResource[];
  main_generation: NamedAPIResource | null;
  version_groups: NamedAPIResource[];
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
  forms_switchable: boolean;
  names: LocalName[];
  form_descriptions: { description: string; language: NamedAPIResource }[];
  pal_park_encounters: {
    base_score: number;
    rate: number;
    area: NamedAPIResource;
  }[];
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

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource | null;
}

export interface PokemonForm {
  name: string;
  form_name: string;
  is_mega: boolean;
  is_battle_only: boolean;
  sprites: { front_default: string | null; front_shiny: string | null };
  names: LocalName[];
  form_names: LocalName[];
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
  stats: PokemonStat[];
  // earlier stats: valid up to and including `generation`
  past_stats?: { generation: NamedAPIResource; stats: PokemonStat[] }[];
  abilities: PokemonAbility[];
  // earlier abilities: valid up to and including `generation`; a null ability
  // means the slot was empty
  past_abilities?: {
    generation: NamedAPIResource;
    abilities: PokemonAbility[];
  }[];
  forms: NamedAPIResource[];
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

export interface PastMoveValues {
  accuracy: number | null;
  power: number | null;
  pp: number | null;
  effect_chance: number | null;
  type: NamedAPIResource | null;
  version_group: NamedAPIResource;
}

/** The effect before `version_group` changed it. */
export interface EffectChange {
  version_group: NamedAPIResource;
  effect_entries: { effect: string; language: NamedAPIResource }[];
}

export interface MachineReference {
  machine: { url: string };
  version_group: NamedAPIResource;
}

export interface Machine {
  id: number;
  item: NamedAPIResource;
  move: NamedAPIResource;
  version_group: NamedAPIResource;
}

export interface ContestCombo {
  use_before: NamedAPIResource[] | null;
  use_after: NamedAPIResource[] | null;
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
  names: LocalName[];
  // the old values, up to but not including `version_group`; null is unchanged
  past_values: PastMoveValues[];
  effect_changes: EffectChange[];
  stat_changes: { change: number; stat: NamedAPIResource }[];
  machines: MachineReference[];
  contest_type: NamedAPIResource | null;
  contest_effect: { url: string } | null;
  super_contest_effect: { url: string } | null;
  contest_combos: {
    normal: ContestCombo;
    super: ContestCombo;
  } | null;
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
  effect_changes: EffectChange[];
  names: LocalName[];
  is_main_series: boolean;
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
  fling_effect: NamedAPIResource | null;
  names: LocalName[];
  machines: MachineReference[];
  game_indices: { game_index: number; generation: NamedAPIResource }[];
  prices: {
    purchase_price: number | null;
    sell_price: number | null;
    currency: NamedAPIResource;
    version_group: NamedAPIResource;
  }[];
  baby_trigger_for: { url: string } | null;
  attributes: NamedAPIResource[];
  sprites: { default: string | null };
  effect_entries: {
    effect: string;
    short_effect: string;
    language: NamedAPIResource;
  }[];
  flavor_text_entries: FlavorTextEntry[];
  held_by_pokemon: {
    pokemon: NamedAPIResource;
    version_details: { rarity: number; version: NamedAPIResource }[];
  }[];
}

export interface ItemCategory {
  name: string;
  pocket: NamedAPIResource;
  items: NamedAPIResource[];
}

export interface Type {
  id: number;
  name: string;
  generation: NamedAPIResource;
  move_damage_class: NamedAPIResource | null;
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
  regions: NamedAPIResource[];
  move_learn_methods: NamedAPIResource[];
}

export interface Generation {
  id: number;
  name: string;
  main_region: NamedAPIResource;
  version_groups: NamedAPIResource[];
  pokemon_species: NamedAPIResource[];
  moves: NamedAPIResource[];
  abilities: NamedAPIResource[];
  types: NamedAPIResource[];
}

export interface Location {
  name: string;
  names: LocalName[];
  region: NamedAPIResource | null;
  areas: NamedAPIResource[];
  game_indices: { game_index: number; generation: NamedAPIResource }[];
}

export interface LocationArea {
  name: string;
  names: LocalName[];
  location: NamedAPIResource;
  encounter_method_rates: {
    encounter_method: NamedAPIResource;
    version_details: { rate: number; version: NamedAPIResource }[];
  }[];
  pokemon_encounters: {
    pokemon: NamedAPIResource;
    version_details: {
      version: NamedAPIResource;
      max_chance: number;
      encounter_details: EncounterDetail[];
    }[];
  }[];
}

export interface Berry {
  id: number;
  name: string;
  growth_time: number;
  max_harvest: number;
  natural_gift_power: number;
  natural_gift_type: NamedAPIResource;
  size: number;
  smoothness: number;
  soil_dryness: number;
  firmness: NamedAPIResource;
  flavors: { potency: number; flavor: NamedAPIResource }[];
  item: NamedAPIResource;
}

export interface Nature {
  name: string;
  names: LocalName[];
  increased_stat: NamedAPIResource | null;
  decreased_stat: NamedAPIResource | null;
  likes_flavor: NamedAPIResource | null;
  hates_flavor: NamedAPIResource | null;
  pokeathlon_stat_changes: {
    max_change: number;
    pokeathlon_stat: NamedAPIResource;
  }[];
  move_battle_style_preferences: {
    low_hp_preference: number;
    high_hp_preference: number;
    move_battle_style: NamedAPIResource;
  }[];
}

export interface Characteristic {
  id: number;
  gene_modulo: number;
  possible_values: number[];
  highest_stat: NamedAPIResource;
  descriptions: { description: string; language: NamedAPIResource }[];
}

export interface ContestEffect {
  id: number;
  appeal: number;
  jam?: number;
  effect_entries?: { effect: string; language: NamedAPIResource }[];
  flavor_text_entries: { flavor_text: string; language: NamedAPIResource }[];
  moves?: NamedAPIResource[];
}

/**
 * The smaller reference resources share their field names, so one page reads
 * them all; each only has some of these.
 */
export interface GuideEntry {
  id: number;
  name?: string;
  names?: LocalName[];
  descriptions?: { description: string; language: NamedAPIResource }[];
  effect_entries?: { effect: string; language: NamedAPIResource }[];
  pokemon_species?: NamedAPIResource[];
  pokemon_species_details?: {
    rate: number;
    pokemon_species: NamedAPIResource;
  }[];
  required_for_evolution?: NamedAPIResource[];
  pokemon_encounters?: {
    base_score: number;
    rate: number;
    pokemon_species: NamedAPIResource;
  }[];
  moves?: NamedAPIResource[];
  items?: NamedAPIResource[];
  categories?: NamedAPIResource[];
  version_groups?: NamedAPIResource[];
  values?: NamedAPIResource[];
  berries?: (NamedAPIResource | { potency: number; berry: NamedAPIResource })[];
  contest_type?: NamedAPIResource;
  berry_flavor?: NamedAPIResource;
  condition?: NamedAPIResource;
  version_group?: NamedAPIResource;
  // growth-rate
  formula?: string;
  levels?: { level: number; experience: number }[];
  // stat
  is_battle_only?: boolean;
  move_damage_class?: NamedAPIResource | null;
  affecting_moves?: {
    increase: { change: number; move: NamedAPIResource }[];
    decrease: { change: number; move: NamedAPIResource }[];
  };
  affecting_natures?:
    | { increase: NamedAPIResource[]; decrease: NamedAPIResource[] }
    | {
        increase: { max_change: number; nature: NamedAPIResource }[];
        decrease: { max_change: number; nature: NamedAPIResource }[];
      };
  affecting_items?: NamedAPIResource[];
  characteristics?: { url: string }[];
  // language
  official?: boolean;
  iso639?: string;
  iso3166?: string;
  // evolution-variable
  symbol?: string;
  data_type?: string;
  source?: string;
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
