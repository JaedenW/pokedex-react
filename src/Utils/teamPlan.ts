import type { Pokemon, Type } from '../types/pokeapi';
import { generationNumber } from './games';
import {
  TYPES,
  attackMultiplier,
  defensiveMultipliers,
  type TypeName,
} from './typeChart';

export const MAX_TEAM = 6;
export const MAX_MOVES = 4;

export interface TeamMember {
  name: string;
  moves: string[];
}

type Relations = Type['damage_relations'];

/* ---------- the team lives in the URL ---------- */

/** "charizard~flamethrower.roost,pikachu" -> members, tolerating bad input */
export function parseTeam(value: string | null): TeamMember[] {
  if (!value) return [];
  const seen = new Set<string>();
  const members: TeamMember[] = [];
  for (const entry of value.split(',')) {
    const [name, moveList = ''] = entry.split('~');
    if (!name || seen.has(name)) continue;
    seen.add(name);
    const moves = [...new Set(moveList.split('.').filter(Boolean))].slice(
      0,
      MAX_MOVES
    );
    members.push({ name, moves });
  }
  return members.slice(0, MAX_TEAM);
}

export function serializeTeam(team: TeamMember[]) {
  return team
    .map((member) =>
      member.moves.length
        ? `${member.name}~${member.moves.join('.')}`
        : member.name
    )
    .join(',');
}

/* ---------- the rules of a particular game ---------- */

/** Types that exist in a generation: Dark and Steel arrived in 2, Fairy in 6. */
export function typesInGeneration(generation: number): TypeName[] {
  return TYPES.filter(
    (type) =>
      !(type === 'fairy' && generation < 6) &&
      !((type === 'dark' || type === 'steel') && generation < 2)
  );
}

/**
 * PokeAPI lists earlier versions of a thing together with the last generation
 * they applied in; pick the earliest such entry that still covers the game.
 */
function pastEntry<T extends { generation: { name: string } }>(
  past: T[] | undefined,
  generation: number
) {
  return [...(past ?? [])]
    .map((entry) => ({ entry, gen: generationNumber(entry.generation.name) }))
    .sort((a, b) => a.gen - b.gen)
    .find(({ gen }) => gen >= generation)?.entry;
}

/** A type's damage chart as it was in a generation (Steel and Ghost changed). */
export function relationsInGeneration(
  type: Type,
  generation: number
): Relations {
  return (
    pastEntry(type.past_damage_relations, generation)?.damage_relations ??
    type.damage_relations
  );
}

/** A Pokémon's types as they were in a generation (Clefairy was Normal). */
export function memberTypesInGeneration(pokemon: Pokemon, generation: number) {
  const types =
    pastEntry(pokemon.past_types, generation)?.types ?? pokemon.types;
  return [...types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name);
}

/* ---------- analysis ---------- */

export interface DefenceRow {
  type: string;
  weak: number;
  resist: number;
  immune: number;
}

/** For each attacking type, how many team members are weak, resistant or immune. */
export function teamDefence(
  memberTypes: string[][],
  relationsByType: Record<string, Relations>,
  generation: number
): DefenceRow[] {
  const perMember = memberTypes.map((types) =>
    defensiveMultipliers(types.map((t) => relationsByType[t]))
  );
  return typesInGeneration(generation).map((type) => ({
    type,
    weak: perMember.filter((m) => m[type] > 1).length,
    resist: perMember.filter((m) => m[type] > 0 && m[type] < 1).length,
    immune: perMember.filter((m) => m[type] === 0).length,
  }));
}

export interface CoverageRow {
  type: string;
  /** The best multiplier any of the attacking types manages */
  best: number;
}

/** How well a set of attacking types hits each single defending type. */
export function coverage(
  attackTypes: string[],
  relationsByType: Record<string, Relations>,
  generation: number
): CoverageRow[] {
  return typesInGeneration(generation).map((defender) => ({
    type: defender,
    best: attackTypes.length
      ? Math.max(
          ...attackTypes.map((attacker) =>
            attackMultiplier(relationsByType[attacker], defender)
          )
        )
      : 1,
  }));
}

/** Plain-language observations about a team's weak points. */
export function teamNotes(
  defence: DefenceRow[],
  hits: CoverageRow[],
  teamSize: number
) {
  const notes: string[] = [];
  const name = (type: string) => type[0].toUpperCase() + type.slice(1);

  for (const row of defence) {
    if (row.weak >= 3 || (row.weak >= 2 && row.resist + row.immune === 0)) {
      notes.push(
        `${row.weak} of ${teamSize} are weak to ${name(row.type)} and ${
          row.resist + row.immune === 0
            ? 'nothing resists it'
            : `only ${row.resist + row.immune} resist${row.resist + row.immune === 1 ? 's' : ''} it`
        }.`
      );
    }
  }
  const missed = hits.filter((row) => row.best <= 1).map((r) => name(r.type));
  if (missed.length && missed.length < hits.length) {
    notes.push(
      `Nothing hits ${missed.join(', ')} super effectively${missed.length > 4 ? ', which is a lot of gaps' : ''}.`
    );
  }
  if (!notes.length && teamSize > 0) {
    notes.push('No glaring weakness: the team is well balanced.');
  }
  return notes;
}
