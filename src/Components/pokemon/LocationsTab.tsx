import React from 'react';
import { useApi, useEncounters } from '../../api/pokeapi';
import {
  formatLocationName,
  getDisplayName,
  versionLabel,
} from '../../Utils/text';
import { EmptyState, Panel, SelectBox } from '../ui';
import type {
  EncounterDetail,
  LocationAreaEncounter,
  NamedAPIResourceList,
  Pokemon,
} from '../../types/pokeapi';

interface MethodSummary {
  method: string;
  conditions: string[];
  minLevel: number;
  maxLevel: number;
  chance: number;
}

// Combines duplicate method/condition rows into one line with summed chance
function summarise(details: EncounterDetail[]) {
  const summary = new Map<string, MethodSummary>();
  for (const detail of details) {
    const conditions = detail.condition_values.map((c) => c.name);
    const key = `${detail.method.name}|${conditions.join(',')}`;
    const existing = summary.get(key);
    summary.set(key, {
      method: detail.method.name,
      conditions,
      minLevel: Math.min(existing?.minLevel ?? Infinity, detail.min_level),
      maxLevel: Math.max(existing?.maxLevel ?? 0, detail.max_level),
      chance: (existing?.chance ?? 0) + detail.chance,
    });
  }
  return [...summary.values()];
}

function AreaCard({
  area,
  version,
}: {
  area: LocationAreaEncounter;
  version: string;
}) {
  const details = area.version_details.find((d) => d.version.name === version);
  if (!details) return null;

  return (
    <li className="rounded-xl border border-pk-line bg-white p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="t-body leading-tight font-bold">
          {formatLocationName(area.location_area.name)}
        </h3>
        <span className="shrink-0 t-small text-pk-muted">
          up to {details.max_chance}%
        </span>
      </div>
      <ul className="mt-2 space-y-1 t-small text-pk-muted">
        {summarise(details.encounter_details).map((row) => (
          <li
            key={`${row.method}${row.conditions}`}
            className="flex flex-wrap gap-x-4"
          >
            <span className="w-28 font-bold text-pk-ink">
              {getDisplayName(row.method)}
            </span>
            <span className="w-20">
              Lv{' '}
              {row.minLevel === row.maxLevel
                ? row.minLevel
                : `${row.minLevel}–${row.maxLevel}`}
            </span>
            <span className="w-14">{row.chance}%</span>
            {row.conditions.length > 0 && (
              <span>
                {row.conditions.map((c) => getDisplayName(c)).join(', ')}
              </span>
            )}
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function LocationsTab({ pokemon }: { pokemon: Pokemon }) {
  const encounters = useEncounters(pokemon.id);
  const versions = useApi<NamedAPIResourceList>('version?limit=100');
  const [chosen, setChosen] = React.useState<string>();

  // games with encounters, oldest first
  const games = React.useMemo(() => {
    const present = new Set(
      encounters.flatMap((e) => e.version_details.map((d) => d.version.name))
    );
    return versions.results
      .map((v) => v.name)
      .filter((name) => present.has(name));
  }, [encounters, versions]);

  if (!games.length) {
    return (
      <EmptyState title="Not found in the wild">
        No wild encounters are recorded for this form. It may be obtained by
        evolving, breeding, trading or as a gift.
      </EmptyState>
    );
  }

  const version = chosen && games.includes(chosen) ? chosen : games.at(-1)!;
  const areas = encounters.filter((e) =>
    e.version_details.some((d) => d.version.name === version)
  );

  return (
    <Panel
      title="Where to find it"
      actions={
        <SelectBox
          label="Game"
          value={version}
          onChange={setChosen}
          className="w-56"
        >
          {games.map((name) => (
            <option key={name} value={name}>
              {versionLabel(name)}
            </option>
          ))}
        </SelectBox>
      }
    >
      <ul className="grid gap-3 md:grid-cols-2">
        {areas.map((area) => (
          <AreaCard
            key={area.location_area.name}
            area={area}
            version={version}
          />
        ))}
      </ul>
    </Panel>
  );
}
