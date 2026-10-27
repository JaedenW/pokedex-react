import { describe, expect, it } from 'vitest';
import {
  cleanFlavorText,
  compareVersionGroups,
  englishFlavorText,
  formLabel,
  formatDexNumber,
  formatGeneration,
  getDisplayName,
  getPokedexLabel,
  versionGroupLabel,
  versionLabel,
} from './text';

const lang = (name: string) => ({ name, url: '' });

describe('getDisplayName', () => {
  it('capitalises each word', () => {
    expect(getDisplayName('mr-mime')).toBe('Mr Mime');
    expect(getDisplayName('double_damage_to', '_')).toBe('Double Damage To');
  });
});

describe('getPokedexLabel', () => {
  it('drops the region name from a regional Pokédex', () => {
    expect(getPokedexLabel('updated-johto', 'johto')).toBe('UPDATED');
    expect(getPokedexLabel('letsgo-kanto', 'kanto')).toBe('LETSGO');
  });

  it('labels the first Pokédex of a region as original', () => {
    expect(getPokedexLabel('kanto', 'kanto')).toBe('ORIGINAL');
  });
});

describe('formatDexNumber', () => {
  it('pads to three digits but never truncates', () => {
    expect(formatDexNumber(7)).toBe('#007');
    expect(formatDexNumber(1025)).toBe('#1025');
  });
});

describe('cleanFlavorText', () => {
  it('replaces the hard line and page breaks', () => {
    expect(cleanFlavorText('Spits fire that\nis hot enough\fto melt.')).toBe(
      'Spits fire that is hot enough to melt.'
    );
  });
});

describe('englishFlavorText', () => {
  it('keeps English entries and reads item text too', () => {
    const entries = englishFlavorText([
      { flavor_text: 'Bonjour', language: lang('fr') },
      { flavor_text: 'Hello\nthere', language: lang('en') },
      { text: 'A potion.', language: lang('en') },
    ]);
    expect(entries.map((e) => e.flavor_text)).toEqual([
      'Hello there',
      'A potion.',
    ]);
  });
});

describe('formLabel', () => {
  it('names forms without repeating the species', () => {
    expect(formLabel('charizard-mega-x', 'charizard')).toBe('Mega X');
    expect(formLabel('charizard', 'charizard')).toBe('Default');
    expect(formLabel('deoxys-attack', 'deoxys')).toBe('Attack');
  });
});

describe('formatGeneration', () => {
  it('uses roman numerals', () => {
    expect(formatGeneration('generation-viii')).toBe('Generation VIII');
  });
});

describe('game names', () => {
  it('has readable names for games', () => {
    expect(versionGroupLabel('sword-shield')).toBe('Sword / Shield');
    expect(versionLabel('firered')).toBe('FireRed');
    expect(versionGroupLabel('some-new-game')).toBe('Some New Game');
  });

  it('orders games by release, not by PokeAPI id', () => {
    const ordered = [
      'legends-za',
      'red-blue',
      'blue-japan',
      'scarlet-violet',
    ].sort(compareVersionGroups);
    expect(ordered).toEqual([
      'blue-japan',
      'red-blue',
      'scarlet-violet',
      'legends-za',
    ]);
  });
});
