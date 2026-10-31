import React from 'react';
import { Link } from 'react-router';
import { idFromUrl, useApi } from '../api/pokeapi';
import { pokemonSpriteUrl } from '../api/sprites';
import { useGame } from '../Hooks/useGame';
import { pokemonHref } from '../Utils/dex';
import { getDisplayName, versionLabel } from '../Utils/text';
import { summarise, type MethodSummary } from './pokemon/LocationsTab';
import { EmptyState, SelectBox } from './ui';
import type {
  LocationArea,
  NamedAPIResource,
  NamedAPIResourceList,
} from '../types/pokeapi';

interface Row extends MethodSummary {
  pokemon: NamedAPIResource;
}

/** What can be caught in one area in one game, grouped by how you find it. */
export default function AreaEncounters({ name }: { name: string }) {
  const area = useApi<LocationArea>(`location-area/${name}`);
  const versions = useApi<NamedAPIResourceList>('version?limit=100');
  const { versions: selected } = useGame();
  const [chosen, setChosen] = React.useState<string>();

  const games = React.useMemo(() => {
    const present = new Set(
      area.pokemon_encounters.flatMap((e) =>
        e.version_details.map((d) => d.version.name)
      )
    );
    return versions.results
      .map((v) => v.name)
      .filter((version) => present.has(version));
  }, [area, versions]);

  if (!games.length) {
    return <EmptyState title="No wild Pokémon are recorded here" />;
  }

  const version =
    chosen && games.includes(chosen)
      ? chosen
      : (games.findLast((v) => selected.includes(v)) ?? games.at(-1)!);

  const byMethod = new Map<string, Row[]>();
  for (const encounter of area.pokemon_encounters) {
    const details = encounter.version_details.find(
      (d) => d.version.name === version
    );
    if (!details) continue;
    for (const row of summarise(details.encounter_details)) {
      byMethod.set(row.method, [
        ...(byMethod.get(row.method) ?? []),
        { ...row, pokemon: encounter.pokemon },
      ]);
    }
  }

  const rates = area.encounter_method_rates.flatMap((entry) => {
    const rate = entry.version_details.find((d) => d.version.name === version);
    return rate ? [[entry.encounter_method.name, rate.rate] as const] : [];
  });
  const rateOf = new Map(rates);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SelectBox
          label="Game"
          value={version}
          onChange={setChosen}
          className="w-56"
        >
          {games.map((game) => (
            <option key={game} value={game}>
              {versionLabel(game)}
            </option>
          ))}
        </SelectBox>
      </div>
      <div className="space-y-5">
        {[...byMethod.entries()].map(([method, rows]) => (
          <section key={method}>
            <h3 className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 t-body font-bold">
              <Link
                to={`/guide/encounter-method/${method}`}
                className="text-pk-navy underline-offset-2 hover:underline"
              >
                {getDisplayName(method)}
              </Link>
              {rateOf.has(method) && (
                <span className="t-small font-normal text-pk-muted">
                  Encounter rate {rateOf.get(method)}%
                </span>
              )}
            </h3>
            <ul className="grid gap-2 md:grid-cols-2">
              {[...rows]
                .sort((a, b) => b.chance - a.chance)
                .map((row) => (
                  <li
                    key={`${row.pokemon.name}${row.conditions}`}
                    className="rounded-xl border border-pk-line bg-white"
                  >
                    <Link
                      to={pokemonHref(row.pokemon.name)}
                      className="flex items-center gap-2 px-2 py-1.5 transition hover:bg-pk-yellow/20"
                    >
                      <img
                        src={pokemonSpriteUrl(idFromUrl(row.pokemon.url))}
                        alt=""
                        loading="lazy"
                        className="size-14 shrink-0 [image-rendering:pixelated]"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block t-body leading-tight font-bold break-words">
                          {getDisplayName(row.pokemon.name)}
                        </span>
                        <span className="block t-small text-pk-muted">
                          Lv{' '}
                          {row.minLevel === row.maxLevel
                            ? row.minLevel
                            : `${row.minLevel}–${row.maxLevel}`}
                          {row.conditions.length > 0 &&
                            ` · ${row.conditions.map((c) => getDisplayName(c)).join(', ')}`}
                        </span>
                      </span>
                      <span className="shrink-0 t-body font-bold text-pk-gold">
                        {row.chance}%
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
