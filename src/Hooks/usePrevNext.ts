import { useApiQuery } from '../api/pokeapi';
import { useDexName } from '../Utils/dex';
import type { NamedAPIResource, Pokedex } from '../types/pokeapi';

export interface Neighbour {
  species: NamedAPIResource;
  number: number;
}

/**
 * The Pokémon before and after this one in the Pokédex being browsed, falling
 * back to the National Pokédex when it isn't listed there.
 */
export function usePrevNext(speciesName: string) {
  const pokedexName = useDexName();
  const current = useApiQuery<Pokedex>(`pokedex/${pokedexName}`);
  const inCurrent = current.data?.pokemon_entries.some(
    (entry) => entry.pokemon_species.name === speciesName
  );
  const needsNational = current.isSuccess && !inCurrent;
  const national = useApiQuery<Pokedex>('pokedex/national', needsNational);

  const dex = inCurrent
    ? current.data
    : needsNational
      ? national.data
      : undefined;
  const entries = dex?.pokemon_entries ?? [];
  const index = entries.findIndex(
    (entry) => entry.pokemon_species.name === speciesName
  );
  const toNeighbour = (position: number): Neighbour | undefined => {
    const entry = entries[position];
    return (
      entry && { species: entry.pokemon_species, number: entry.entry_number }
    );
  };

  return {
    prev: index > 0 ? toNeighbour(index - 1) : undefined,
    next: index >= 0 ? toNeighbour(index + 1) : undefined,
    number: index >= 0 ? entries[index].entry_number : undefined,
    pokedex: inCurrent ? pokedexName : 'national',
  };
}
