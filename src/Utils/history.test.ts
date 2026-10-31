import { describe, expect, it } from 'vitest';
import {
  abilitiesInGeneration,
  moveHistory,
  moveValuesIn,
  statsInGeneration,
} from './history';
import { compareVersionGroups, englishName, locationLabel } from './text';
import type { Move, Pokemon } from '../types/pokeapi';

const r = (name: string) => ({ name, url: '' });
const past = (
  group: string,
  values: { power?: number; accuracy?: number; type?: string }
) => ({
  accuracy: values.accuracy ?? null,
  power: values.power ?? null,
  pp: null,
  effect_chance: null,
  type: values.type ? r(values.type) : null,
  version_group: r(group),
});

// Tackle: 35/95 up to Gen 4, 50/100 in Gen 5 and 6, 40/100 from Gen 7
const tackle = {
  power: 40,
  accuracy: 100,
  pp: 35,
  effect_chance: null,
  type: r('normal'),
  past_values: [
    past('sun-moon', { power: 50 }),
    past('black-white', { power: 35, accuracy: 95 }),
  ],
} as unknown as Move;

describe('moveValuesIn', () => {
  it('gives the old values before the game that changed them', () => {
    expect(moveValuesIn(tackle, 'platinum')).toMatchObject({
      power: 35,
      accuracy: 95,
    });
  });

  it('takes each field from the next change that touched it', () => {
    expect(moveValuesIn(tackle, 'black-white')).toMatchObject({
      power: 50,
      accuracy: 100,
    });
  });

  it('uses the current values from the changing game onwards', () => {
    expect(moveValuesIn(tackle, 'sun-moon').power).toBe(40);
    expect(moveValuesIn(tackle, 'scarlet-violet').power).toBe(40);
    expect(moveValuesIn(tackle, null).power).toBe(40);
  });

  it('can change a move type', () => {
    const bite = {
      type: r('dark'),
      past_values: [past('gold-silver', { type: 'normal' })],
    } as unknown as Move;
    expect(moveValuesIn(bite, 'red-blue').type.name).toBe('normal');
    expect(moveValuesIn(bite, 'gold-silver').type.name).toBe('dark');
  });

  it('counts Colosseum as a Generation III game', () => {
    expect(moveValuesIn(tackle, 'colosseum').power).toBe(35);
  });
});

describe('moveHistory', () => {
  it('runs oldest first', () => {
    expect(moveHistory(tackle).map((p) => p.version_group.name)).toEqual([
      'black-white',
      'sun-moon',
    ]);
  });
});

describe('compareVersionGroups', () => {
  it('orders games by release', () => {
    expect(compareVersionGroups('emerald', 'colosseum')).toBeLessThan(0);
    expect(compareVersionGroups('xd', 'diamond-pearl')).toBeLessThan(0);
    expect(compareVersionGroups('black-white', 'x-y')).toBeLessThan(0);
  });
});

const ability = (name: string | null, slot: number, is_hidden = false) => ({
  ability: name ? r(name) : null,
  slot,
  is_hidden,
});

// Clefable: Magic Guard from Gen 4, Unaware from Gen 5
const clefable = {
  abilities: [
    ability('cute-charm', 1),
    ability('magic-guard', 2),
    ability('unaware', 3, true),
  ],
  past_abilities: [
    { generation: r('generation-iii'), abilities: [ability(null, 2)] },
    { generation: r('generation-iv'), abilities: [ability(null, 3, true)] },
  ],
} as unknown as Pokemon;

const names = (pokemon: Pokemon, generation: number) =>
  abilitiesInGeneration(pokemon, generation).map((a) => a.ability?.name);

describe('abilitiesInGeneration', () => {
  it('has none before generation 3', () => {
    expect(names(clefable, 2)).toEqual([]);
  });

  it('removes slots that were empty back then', () => {
    expect(names(clefable, 3)).toEqual(['cute-charm']);
    expect(names(clefable, 4)).toEqual(['cute-charm', 'magic-guard']);
    expect(names(clefable, 5)).toEqual([
      'cute-charm',
      'magic-guard',
      'unaware',
    ]);
  });

  it('uses the entry closest to the game when a slot changed twice', () => {
    const pokemon = {
      abilities: [ability('c', 1)],
      past_abilities: [
        { generation: r('generation-vi'), abilities: [ability('b', 1)] },
        { generation: r('generation-iv'), abilities: [ability('a', 1)] },
      ],
    } as unknown as Pokemon;
    expect(names(pokemon, 3)).toEqual(['a']);
    expect(names(pokemon, 5)).toEqual(['b']);
    expect(names(pokemon, 7)).toEqual(['c']);
  });
});

const stat = (name: string, base_stat: number) => ({
  base_stat,
  effort: 0,
  stat: r(name),
});

const clefableStats = {
  stats: [
    stat('hp', 95),
    stat('special-attack', 95),
    stat('special-defense', 90),
    stat('speed', 60),
  ],
  past_stats: [
    { generation: r('generation-i'), stats: [stat('special', 85)] },
    { generation: r('generation-v'), stats: [stat('special-attack', 85)] },
  ],
} as unknown as Pokemon;

const base = (generation: number) =>
  statsInGeneration(clefableStats, generation).map((s) => [
    s.stat.name,
    s.base_stat,
  ]);

describe('statsInGeneration', () => {
  it('leaves current stats alone', () => {
    expect(base(9)).toContainEqual(['special-attack', 95]);
  });

  it('applies changes up to and including their generation', () => {
    expect(base(5)).toContainEqual(['special-attack', 85]);
    expect(base(6)).toContainEqual(['special-attack', 95]);
  });

  it('folds the specials into one stat in generation 1', () => {
    expect(base(1)).toEqual([
      ['hp', 95],
      ['special', 85],
      ['speed', 60],
    ]);
  });
});

describe('labels', () => {
  it('reads English names', () => {
    const names = [
      { name: 'Forêt', language: r('fr') },
      { name: 'Eterna Forest', language: r('en') },
    ];
    expect(englishName(names, 'eterna-forest')).toBe('Eterna Forest');
    expect(englishName([], 'eterna-forest')).toBe('Eterna Forest');
  });

  it('drops the region from a location name', () => {
    expect(locationLabel('sinnoh-route-201', 'sinnoh')).toBe('Route 201');
    expect(locationLabel('canalave-city', 'sinnoh')).toBe('Canalave City');
  });
});
