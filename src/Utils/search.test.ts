import { describe, expect, it } from 'vitest';
import { rankMatch, searchNames } from './search';

describe('rankMatch', () => {
  it('prefers exact, then prefix, then word-start, then substring', () => {
    expect(rankMatch('pikachu', 'pikachu')).toBe(0);
    expect(rankMatch('pika', 'pikachu')).toBe(1);
    expect(rankMatch('mime', 'mr-mime')).toBe(2);
    expect(rankMatch('kach', 'pikachu')).toBe(3);
    expect(rankMatch('zzz', 'pikachu')).toBe(Infinity);
  });

  it('ignores case, hyphens and punctuation', () => {
    expect(rankMatch('Mr. Mime', 'mr-mime')).toBe(0);
    expect(rankMatch('ho oh', 'ho-oh')).toBe(0);
    expect(rankMatch('farfetchd', "farfetch'd")).toBe(0);
  });

  it('does not match an empty query', () => {
    expect(rankMatch('  ', 'pikachu')).toBe(Infinity);
  });
});

describe('searchNames', () => {
  const species = [
    {
      name: 'charcadet',
      url: 'https://pokeapi.co/api/v2/pokemon-species/935/',
    },
    { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon-species/6/' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon-species/4/' },
    {
      name: 'pecharunt',
      url: 'https://pokeapi.co/api/v2/pokemon-species/1025/',
    },
  ];

  it('lists lower Pokédex numbers first among equal matches', () => {
    expect(searchNames('char', species, 10).map((s) => s.name)).toEqual([
      'charmander',
      'charizard',
      'charcadet',
      'pecharunt',
    ]);
  });

  it('respects the limit and drops non-matches', () => {
    expect(searchNames('char', species, 2)).toHaveLength(2);
    expect(searchNames('xyz', species, 5)).toEqual([]);
  });

  it('works without urls', () => {
    const names = [{ name: 'tackle' }, { name: 'tail-whip' }];
    expect(searchNames('ta', names, 5).map((n) => n.name)).toEqual([
      'tackle',
      'tail-whip',
    ]);
  });
});
