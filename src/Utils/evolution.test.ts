import { describe, expect, it } from 'vitest';
import { describeEvolution } from './evolution';

const named = (name: string) => ({ name, url: '' });

describe('describeEvolution', () => {
  it('describes a level requirement', () => {
    expect(
      describeEvolution({ trigger: named('level-up'), min_level: 16 })
    ).toBe('Level 16');
  });

  it('describes item use', () => {
    expect(
      describeEvolution({
        trigger: named('use-item'),
        item: named('thunder-stone'),
      })
    ).toBe('Use Thunder Stone');
  });

  it('describes trades, with and without a held item', () => {
    expect(describeEvolution({ trigger: named('trade') })).toBe('Trade');
    expect(
      describeEvolution({
        trigger: named('trade'),
        held_item: named('metal-coat'),
      })
    ).toBe('Trade, holding Metal Coat');
  });

  it('combines friendship with the time of day', () => {
    expect(
      describeEvolution({
        trigger: named('level-up'),
        min_happiness: 160,
        time_of_day: 'day',
      })
    ).toBe('Level up, friendship 160+, during the day');
  });

  it('describes stat-based branches like Tyrogue', () => {
    expect(
      describeEvolution({
        trigger: named('level-up'),
        min_level: 20,
        relative_physical_stats: 1,
      })
    ).toBe('Level 20, Attack higher than Defense');
    expect(
      describeEvolution({
        trigger: named('level-up'),
        min_level: 20,
        relative_physical_stats: 0,
      })
    ).toBe('Level 20, Attack equal to Defense');
  });

  it('describes move and gender requirements', () => {
    expect(
      describeEvolution({
        trigger: named('level-up'),
        known_move_type: named('fairy'),
        min_affection: 2,
      })
    ).toBe('Level up, knowing a Fairy-type move, affection 2+');
    expect(
      describeEvolution({
        trigger: named('level-up'),
        min_level: 32,
        gender: 1,
      })
    ).toBe('Level 32, female only');
  });

  it('falls back to a plain level up', () => {
    expect(describeEvolution({ trigger: named('level-up') })).toBe('Level up');
  });
});
