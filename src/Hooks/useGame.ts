import React from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { apiQuery, idFromUrl, useApi, useOptionalApi } from '../api/pokeapi';
import { generationNumber } from '../Utils/games';
import { useSelection } from '../Utils/selection';
import { compareVersionGroups } from '../Utils/text';
import type {
  Generation,
  NamedAPIResourceList,
  Pokedex,
  VersionGroup,
} from '../types/pokeapi';

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

// Shadow moves are generation 3 data, but only exist in Colosseum and XD
const GAMECUBE_ONLY_ID = 10000;

/**
 * Everything of a kind introduced up to a generation, so long lists can hide
 * later additions; null when `generation` is 0.
 */
export function useIntroducedBy(
  generation: number,
  field: 'moves' | 'abilities' | 'pokemon_species',
  gameCube = false
) {
  const results = useSuspenseQueries({
    queries: Array.from({ length: generation }, (_, index) =>
      apiQuery<Generation>(`generation/${index + 1}`)
    ),
  });
  const key = results.map((r) => r.dataUpdatedAt).join(',');
  return React.useMemo(
    () =>
      generation
        ? new Set(
            results.flatMap((r) =>
              r.data[field]
                .filter((x) => gameCube || idFromUrl(x.url) < GAMECUBE_ONLY_ID)
                .map((x) => x.name)
            )
          )
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, generation, field, gameCube]
  );
}

/** What existed in the selected game; null with no game, or when `all` is set. */
export function useIntroducedByGame(
  field: 'moves' | 'abilities',
  all: boolean
) {
  const { game, generation } = useGame();
  return useIntroducedBy(
    generation && !all ? generation : 0,
    field,
    game === 'colosseum' || game === 'xd'
  );
}

/** Every game, oldest first, grouped under its generation number. */
export function useGamesByGeneration() {
  const list = useApi<NamedAPIResourceList>('version-group?limit=50');
  const results = useSuspenseQueries({
    queries: list.results.map((g) =>
      apiQuery<VersionGroup>(`version-group/${g.name}`)
    ),
  });
  const key = results.map((r) => r.dataUpdatedAt).join(',');
  return React.useMemo(() => {
    const games = results
      .map((r) => r.data)
      .sort((a, b) => compareVersionGroups(a.name, b.name));
    const generations = new Map<number, VersionGroup[]>();
    for (const game of games) {
      const number = generationNumber(game.generation.name);
      generations.set(number, [...(generations.get(number) ?? []), game]);
    }
    return {
      games,
      generations: [...generations.entries()].sort(([a], [b]) => a - b),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
