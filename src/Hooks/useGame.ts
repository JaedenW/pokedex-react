import React from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { apiQuery, useOptionalApi } from '../api/pokeapi';
import { generationNumber } from '../Utils/games';
import { useSelection } from '../Utils/selection';
import type { Pokedex, VersionGroup } from '../types/pokeapi';

/** The selected game's details; empty while no game is selected. */
export function useGame() {
  const { game } = useSelection();
  const group = useOptionalApi<VersionGroup>(
    game ? `version-group/${game}` : null
  );
  return {
    game,
    group,
    generation: group ? generationNumber(group.generation.name) : null,
    /** The game's individual versions, e.g. Diamond and Pearl */
    versions: group?.versions.map((v) => v.name) ?? [],
  };
}

/** The Pokémon a game offers, from its Pokédexes; null when it has none. */
export function useGameRoster(pokedexNames: string[]) {
  const dexes = useSuspenseQueries({
    queries: pokedexNames.map((name) => apiQuery<Pokedex>(`pokedex/${name}`)),
  });
  const key = dexes.map((d) => d.dataUpdatedAt).join(',');
  return React.useMemo(() => {
    if (!dexes.length) return null;
    return new Set(
      dexes.flatMap((d) =>
        d.data.pokemon_entries.map((e) => e.pokemon_species.name)
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
