import type {
  Move,
  NamedAPIResource,
  PastMoveValues,
  Pokemon,
  PokemonAbility,
  PokemonStat,
} from '../types/pokeapi';
import { generationNumber } from './games';
import { compareVersionGroups } from './text';

/*
  PokeAPI records history two ways. Moves list their old values against the
  version group that changed them, so an entry applies to games BEFORE it.
  Pokémon list theirs against the last generation they applied in, so an entry
  applies UP TO AND INCLUDING it.
*/

export interface MoveValues {
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  effect_chance: number | null;
  type: NamedAPIResource;
}

/** A move's numbers as they were in a game. */
export function moveValuesIn(move: Move, game: string | null): MoveValues {
  const values: MoveValues = {
    power: move.power,
    accuracy: move.accuracy,
    pp: move.pp,
    effect_chance: move.effect_chance,
    type: move.type,
  };
  if (!game) return values;

  const later = (move.past_values ?? [])
    .filter((past) => compareVersionGroups(past.version_group.name, game) > 0)
    .sort((a, b) =>
      compareVersionGroups(a.version_group.name, b.version_group.name)
    );
  // each field comes from the first later change that touched it
  const first = <K extends keyof PastMoveValues>(key: K) =>
    later.find((past) => past[key] !== null)?.[key];

  return {
    power: first('power') ?? values.power,
    accuracy: first('accuracy') ?? values.accuracy,
    pp: first('pp') ?? values.pp,
    effect_chance: first('effect_chance') ?? values.effect_chance,
    type: first('type') ?? values.type,
  };
}

/** Every change to a move, oldest first, as "before this game" rows. */
export function moveHistory(move: Move) {
  return [...(move.past_values ?? [])].sort((a, b) =>
    compareVersionGroups(a.version_group.name, b.version_group.name)
  );
}

/** Abilities in a generation; they only arrived in generation 3. */
export function abilitiesInGeneration(
  pokemon: Pokemon,
  generation: number
): PokemonAbility[] {
  if (generation < 3) return [];
  const slots = new Map(pokemon.abilities.map((a) => [a.slot, a]));
  const past = [...(pokemon.past_abilities ?? [])]
    .map((entry) => ({
      ...entry,
      gen: generationNumber(entry.generation.name),
    }))
    .filter(({ gen }) => gen >= generation)
    .sort((a, b) => b.gen - a.gen);
  // newest first, so the entry closest to the game is applied last
  for (const entry of past) {
    for (const ability of entry.abilities) slots.set(ability.slot, ability);
  }
  return [...slots.values()]
    .filter((a) => a.ability)
    .sort((a, b) => a.slot - b.slot);
}

/**
 * Base stats in a generation. Generation 1 had one Special stat, which takes
 * the place of Special Attack and Special Defense.
 */
export function statsInGeneration(
  pokemon: Pokemon,
  generation: number
): PokemonStat[] {
  const stats = new Map(pokemon.stats.map((s) => [s.stat.name, s]));
  const past = [...(pokemon.past_stats ?? [])]
    .map((entry) => ({
      ...entry,
      gen: generationNumber(entry.generation.name),
    }))
    .filter(({ gen }) => gen >= generation)
    .sort((a, b) => b.gen - a.gen);
  for (const entry of past) {
    for (const stat of entry.stats) stats.set(stat.stat.name, stat);
  }

  const special = stats.get('special');
  return [...stats.values()].flatMap((stat) => {
    if (stat.stat.name === 'special') return [];
    if (!special) return [stat];
    if (stat.stat.name === 'special-attack') return [special];
    return stat.stat.name === 'special-defense' ? [] : [stat];
  });
}
