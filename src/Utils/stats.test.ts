import { describe, expect, it } from 'vitest';
import {
  baseStatTotal,
  calcStat,
  catchChance,
  genderRatio,
  hatchSteps,
} from './stats';

describe('calcStat', () => {
  it('matches the in-game formula for Pikachu at level 100', () => {
    // 31 IVs, no EVs, neutral nature
    expect(calcStat(35, 100, { isHp: true })).toBe(211);
    expect(calcStat(55, 100)).toBe(146);
  });

  it('applies EVs and nature', () => {
    expect(calcStat(55, 100, { evs: 252, nature: 1.1 })).toBe(
      Math.floor((Math.floor(((2 * 55 + 31 + 63) * 100) / 100) + 5) * 1.1)
    );
    expect(calcStat(55, 100, { nature: 0.9 })).toBeLessThan(calcStat(55, 100));
  });

  it('always gives Shedinja 1 HP', () => {
    expect(calcStat(1, 100, { isHp: true, evs: 252 })).toBe(1);
  });

  it('scales with level', () => {
    expect(calcStat(100, 50)).toBeLessThan(calcStat(100, 100));
  });
});

describe('baseStatTotal', () => {
  it('adds up the base stats', () => {
    expect(
      baseStatTotal([{ base_stat: 78 }, { base_stat: 84 }, { base_stat: 78 }])
    ).toBe(240);
  });
});

describe('genderRatio', () => {
  it('converts eighths into percentages', () => {
    expect(genderRatio(1)).toEqual({ female: 12.5, male: 87.5 });
    expect(genderRatio(4)).toEqual({ female: 50, male: 50 });
    expect(genderRatio(8)).toEqual({ female: 100, male: 0 });
  });

  it('returns null for genderless Pokémon', () => {
    expect(genderRatio(-1)).toBeNull();
  });
});

describe('hatchSteps and catchChance', () => {
  it('derives steps from egg cycles', () => {
    expect(hatchSteps(20)).toBe(5355);
  });

  it('caps at certain capture and scales from the capture rate', () => {
    expect(catchChance(255)).toBeCloseTo(33.33, 1);
    expect(catchChance(3)).toBeLessThan(1);
    expect(catchChance(1000)).toBe(100);
  });
});
