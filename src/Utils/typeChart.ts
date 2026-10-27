import type { Type } from '../types/pokeapi';

// The 18 standard types in Pokédex order
export const TYPES = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
] as const;

export type TypeName = (typeof TYPES)[number];

type Relations = Type['damage_relations'];

const names = (relations: Relations, key: string) =>
  (relations[key] ?? []).map((resource) => resource.name);

/** Damage multiplier each attacking type deals to a Pokémon of these types. */
export function defensiveMultipliers(defending: Relations[]) {
  const result = Object.fromEntries(TYPES.map((t) => [t, 1])) as Record<
    TypeName,
    number
  >;
  for (const relations of defending) {
    for (const t of names(relations, 'double_damage_from')) {
      if (t in result) result[t as TypeName] *= 2;
    }
    for (const t of names(relations, 'half_damage_from')) {
      if (t in result) result[t as TypeName] *= 0.5;
    }
    for (const t of names(relations, 'no_damage_from')) {
      if (t in result) result[t as TypeName] *= 0;
    }
  }
  return result;
}

/** Damage multiplier of one attacking type against a single defending type. */
export function attackMultiplier(attacker: Relations, defender: string) {
  if (names(attacker, 'double_damage_to').includes(defender)) return 2;
  if (names(attacker, 'half_damage_to').includes(defender)) return 0.5;
  if (names(attacker, 'no_damage_to').includes(defender)) return 0;
  return 1;
}

export const formatMultiplier = (multiplier: number) =>
  multiplier === 0
    ? '0'
    : multiplier === 0.5
      ? '½'
      : multiplier === 0.25
        ? '¼'
        : String(multiplier);

/** Groups attacking types by how effective they are against the defender. */
export function groupByMultiplier(multipliers: Record<string, number>) {
  const groups = new Map<number, string[]>();
  for (const [type, value] of Object.entries(multipliers)) {
    if (value === 1) continue;
    groups.set(value, [...(groups.get(value) ?? []), type]);
  }
  return [...groups.entries()].sort(([a], [b]) => b - a);
}
