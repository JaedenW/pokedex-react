import type { PokemonSpecies } from '../types/pokeapi';

export function getDisplayName(name: string, delim = '-') {
  return name
    .split(delim)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getPokedexLabel(pokedexName: string, regionName: string) {
  const words = pokedexName
    .split('-')
    .filter((word) => word !== regionName && word);
  return words.length ? words.join(' ').toUpperCase() : 'ORIGINAL';
}

export function getDefaultVariety(species: PokemonSpecies) {
  return (
    species.varieties.find((variety) => variety.is_default) ??
    species.varieties[0]
  );
}
