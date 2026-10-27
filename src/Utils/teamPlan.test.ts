import { describe, expect, it } from 'vitest';
import {
  coverage,
  memberTypesInGeneration,
  parseTeam,
  relationsInGeneration,
  serializeTeam,
  teamDefence,
  teamNotes,
  typesInGeneration,
} from './teamPlan';
import { generationNumber } from './games';
import { pokemonHref } from './dex';
import type { Pokemon, Type } from '../types/pokeapi';

const named = (...names: string[]) => names.map((name) => ({ name, url: '' }));
const gen = (name: string) => ({ name, url: '' });

describe('generationNumber', () => {
  it('reads roman numerals', () => {
    expect(generationNumber('generation-i')).toBe(1);
    expect(generationNumber('generation-iv')).toBe(4);
    expect(generationNumber('generation-vii')).toBe(7);
    expect(generationNumber('generation-viii')).toBe(8);
    expect(generationNumber('generation-ix')).toBe(9);
  });
});

describe('pokemonHref', () => {
  it('points at the Pokémon page', () => {
    expect(pokemonHref('gengar')).toBe('/pokemon/gengar');
  });
});

describe('parseTeam and serializeTeam', () => {
  it('reads Pokémon and their moves', () => {
    expect(parseTeam('charizard~flamethrower.roost,pikachu')).toEqual([
      { name: 'charizard', moves: ['flamethrower', 'roost'] },
      { name: 'pikachu', moves: [] },
    ]);
  });

  it('round-trips', () => {
    const value = 'charizard~flamethrower.roost,pikachu,mr-mime~psychic';
    expect(serializeTeam(parseTeam(value))).toBe(value);
  });

  it('copes with empty and malformed input', () => {
    expect(parseTeam(null)).toEqual([]);
    expect(parseTeam('')).toEqual([]);
    expect(parseTeam(',,~x,~')).toEqual([]);
  });

  it('drops repeats and enforces the limits', () => {
    expect(parseTeam('a,a,b~m.m').map((m) => m.name)).toEqual(['a', 'b']);
    expect(parseTeam('a~m.m')[0].moves).toEqual(['m']);
    expect(parseTeam('a,b,c,d,e,f,g,h')).toHaveLength(6);
    expect(parseTeam('a~1.2.3.4.5.6')[0].moves).toHaveLength(4);
  });
});

describe('typesInGeneration', () => {
  it('adds Dark and Steel in generation 2 and Fairy in generation 6', () => {
    expect(typesInGeneration(1)).toHaveLength(15);
    expect(typesInGeneration(1)).not.toContain('dark');
    expect(typesInGeneration(1)).not.toContain('steel');
    expect(typesInGeneration(2)).toContain('steel');
    expect(typesInGeneration(5)).toHaveLength(17);
    expect(typesInGeneration(5)).not.toContain('fairy');
    expect(typesInGeneration(6)).toHaveLength(18);
  });
});

describe('relationsInGeneration', () => {
  const current = { half_damage_from: named('fairy') };
  const type = {
    damage_relations: current,
    past_damage_relations: [
      {
        generation: gen('generation-v'),
        damage_relations: { half_damage_from: named('ghost', 'dark') },
      },
      {
        generation: gen('generation-i'),
        damage_relations: { half_damage_from: named('old') },
      },
    ],
  } as unknown as Type;

  it('uses the earliest listed version that still covers the game', () => {
    expect(relationsInGeneration(type, 1).half_damage_from).toEqual(
      named('old')
    );
    expect(relationsInGeneration(type, 2).half_damage_from).toEqual(
      named('ghost', 'dark')
    );
    expect(relationsInGeneration(type, 5).half_damage_from).toEqual(
      named('ghost', 'dark')
    );
  });

  it('uses the current chart for newer games or when nothing changed', () => {
    expect(relationsInGeneration(type, 6)).toBe(current);
    expect(
      relationsInGeneration({ damage_relations: current } as unknown as Type, 3)
    ).toBe(current);
  });
});

describe('memberTypesInGeneration', () => {
  const clefairy = {
    types: [{ slot: 1, type: gen('fairy') }],
    past_types: [
      {
        generation: gen('generation-v'),
        types: [{ slot: 1, type: gen('normal') }],
      },
    ],
  } as unknown as Pokemon;

  it('gives the types a Pokémon had in an older game', () => {
    expect(memberTypesInGeneration(clefairy, 3)).toEqual(['normal']);
    expect(memberTypesInGeneration(clefairy, 6)).toEqual(['fairy']);
  });

  it('keeps slot order', () => {
    const dual = {
      types: [
        { slot: 2, type: gen('flying') },
        { slot: 1, type: gen('fire') },
      ],
    } as unknown as Pokemon;
    expect(memberTypesInGeneration(dual, 9)).toEqual(['fire', 'flying']);
  });
});

describe('teamDefence and coverage', () => {
  const relations = {
    fire: {
      double_damage_from: named('water', 'ground', 'rock'),
      half_damage_from: named('fire', 'grass'),
      double_damage_to: named('grass'),
      half_damage_to: named('water'),
    },
    water: {
      double_damage_from: named('grass', 'electric'),
      half_damage_from: named('fire', 'water'),
      double_damage_to: named('fire'),
      half_damage_to: named('grass'),
    },
  };

  it('counts weak and resistant members per attacking type', () => {
    const rows = teamDefence([['fire'], ['water']], relations, 9);
    const row = (type: string) => rows.find((r) => r.type === type)!;
    expect(row('water')).toMatchObject({ weak: 1, resist: 1, immune: 0 });
    expect(row('grass')).toMatchObject({ weak: 1, resist: 1 });
    expect(row('rock')).toMatchObject({ weak: 1, resist: 0 });
  });

  it('only reports types that exist in the generation', () => {
    expect(teamDefence([['fire']], relations, 1)).toHaveLength(15);
  });

  it('finds the best multiplier any attacking type manages', () => {
    const rows = coverage(['fire', 'water'], relations, 9);
    const best = (type: string) => rows.find((r) => r.type === type)!.best;
    expect(best('grass')).toBe(2);
    expect(best('fire')).toBe(2);
    expect(best('normal')).toBe(1);
  });

  it('treats an empty attack list as neutral', () => {
    expect(coverage([], relations, 9).every((r) => r.best === 1)).toBe(true);
  });
});

describe('teamNotes', () => {
  it('flags a shared weakness nothing resists', () => {
    const defence = [
      { type: 'rock', weak: 3, resist: 0, immune: 0 },
      { type: 'fire', weak: 0, resist: 2, immune: 0 },
    ];
    const hits = [{ type: 'rock', best: 2 }];
    expect(teamNotes(defence, hits, 4).join(' ')).toContain(
      '3 of 4 are weak to Rock and nothing resists it'
    );
  });

  it('names types nothing hits super effectively', () => {
    const hits = [
      { type: 'water', best: 1 },
      { type: 'fire', best: 2 },
    ];
    expect(teamNotes([], hits, 2).join(' ')).toContain('Nothing hits Water');
  });

  it('is positive when there is nothing wrong', () => {
    expect(teamNotes([], [{ type: 'fire', best: 2 }], 3)[0]).toMatch(
      /well balanced/
    );
  });
});
