import { describe, expect, it } from 'vitest';
import {
  attackMultiplier,
  defensiveMultipliers,
  formatMultiplier,
  groupByMultiplier,
} from './typeChart';

const named = (...names: string[]) => names.map((name) => ({ name, url: '' }));

// Just the relations needed for these cases
const fire = {
  double_damage_from: named('ground', 'rock', 'water'),
  half_damage_from: named('bug', 'steel', 'fire', 'grass', 'ice', 'fairy'),
};
const flying = {
  double_damage_from: named('rock', 'electric', 'ice'),
  half_damage_from: named('grass', 'fighting', 'bug'),
  no_damage_from: named('ground'),
};
const water = {
  double_damage_from: named('grass', 'electric'),
  half_damage_from: named('fire', 'water', 'ice', 'steel'),
};

describe('defensiveMultipliers', () => {
  it('stacks weaknesses of both types', () => {
    const charizard = defensiveMultipliers([fire, flying]);
    expect(charizard.rock).toBe(4);
    expect(charizard.water).toBe(2);
    expect(charizard.electric).toBe(2);
  });

  it('lets a resistance cancel a weakness', () => {
    // fire resists ice and flying is weak to it: x0.5 * x2
    expect(defensiveMultipliers([fire, flying]).ice).toBe(1);
  });

  it('treats immunities as zero whatever the other type says', () => {
    // fire is weak to ground but flying is immune
    expect(defensiveMultipliers([fire, flying]).ground).toBe(0);
  });

  it('reaches quarter damage from double resistance', () => {
    const multipliers = defensiveMultipliers([water, flying]);
    expect(multipliers.electric).toBe(4);
    expect(multipliers.bug).toBe(0.5);
    expect(defensiveMultipliers([fire, fire]).bug).toBe(0.25);
  });

  it('covers all 18 types', () => {
    expect(Object.keys(defensiveMultipliers([fire]))).toHaveLength(18);
  });
});

describe('attackMultiplier', () => {
  const attacker = {
    double_damage_to: named('grass'),
    half_damage_to: named('water'),
    no_damage_to: named('ghost'),
  };

  it('reads each relation', () => {
    expect(attackMultiplier(attacker, 'grass')).toBe(2);
    expect(attackMultiplier(attacker, 'water')).toBe(0.5);
    expect(attackMultiplier(attacker, 'ghost')).toBe(0);
    expect(attackMultiplier(attacker, 'normal')).toBe(1);
  });
});

describe('groupByMultiplier', () => {
  it('orders the most dangerous group first and omits neutral hits', () => {
    const groups = groupByMultiplier({ a: 1, b: 4, c: 0.5, d: 2, e: 0, f: 2 });
    expect(groups.map(([multiplier]) => multiplier)).toEqual([4, 2, 0.5, 0]);
    expect(groups[1][1]).toEqual(['d', 'f']);
  });
});

describe('formatMultiplier', () => {
  it('uses fractions for resistances', () => {
    expect(formatMultiplier(0.5)).toBe('½');
    expect(formatMultiplier(0.25)).toBe('¼');
    expect(formatMultiplier(0)).toBe('0');
    expect(formatMultiplier(4)).toBe('4');
  });
});
