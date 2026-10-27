import { useSuspenseQueries } from '@tanstack/react-query';
import { apiQuery } from '../../api/pokeapi';
import {
  coverage,
  memberTypesInGeneration,
  relationsInGeneration,
  teamDefence,
  teamNotes,
  type TeamMember,
} from '../../Utils/teamPlan';
import { STAT_LABELS, baseStatTotal } from '../../Utils/stats';
import { TYPES, formatMultiplier } from '../../Utils/typeChart';
import { getDisplayName } from '../../Utils/text';
import { cn } from '../../Utils/cn';
import { Panel } from '../ui';
import { TypeIcon } from '../TypeBadge';
import { memberQuery } from './useMember';
import type { Move, Type } from '../../types/pokeapi';

const STAT_ORDER = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
];

const COVERAGE_TONE: Record<number, string> = {
  4: 'bg-green-600 text-white',
  2: 'bg-green-500 text-white',
  1: 'bg-white text-pk-muted',
  0.5: 'bg-red-400 text-white',
  0.25: 'bg-red-500 text-white',
  0: 'bg-pk-ink text-white',
};

export default function TeamAnalysis({
  team,
  generation,
}: {
  team: TeamMember[];
  generation: number;
}) {
  const members = useSuspenseQueries({
    queries: team.map((member) => memberQuery(member.name)),
  });
  const typeResults = useSuspenseQueries({
    queries: TYPES.map((type) => apiQuery<Type>(`type/${type}`)),
  });
  const moveNames = [...new Set(team.flatMap((member) => member.moves))];
  const moveResults = useSuspenseQueries({
    queries: moveNames.map((name) => apiQuery<Move>(`move/${name}`)),
  });

  // the chart as it was in this game's generation
  const relations = Object.fromEntries(
    TYPES.map((type, i) => [
      type,
      relationsInGeneration(typeResults[i].data, generation),
    ])
  );
  const memberTypes = members.map((m) =>
    memberTypesInGeneration(m.data.pokemon, generation).filter(
      (type) => type in relations
    )
  );

  const damagingTypes = [
    ...new Set(
      moveResults
        .map((r) => r.data)
        .filter((move) => move.damage_class.name !== 'status')
        .map((move) => move.type.name)
    ),
  ];
  const usingMoves = damagingTypes.length > 0;
  const attackTypes = usingMoves
    ? damagingTypes
    : [...new Set(memberTypes.flat())];

  const defence = teamDefence(memberTypes, relations, generation);
  const hits = coverage(attackTypes, relations, generation);
  const notes = teamNotes(defence, hits, team.length);

  const statRows = members.map((m, i) => ({
    name: team[i].name,
    stats: STAT_ORDER.map(
      (key) =>
        m.data.pokemon.stats.find((s) => s.stat.name === key)?.base_stat ?? 0
    ),
    total: baseStatTotal(m.data.pokemon.stats),
  }));
  const best = STAT_ORDER.map((_, col) =>
    Math.max(...statRows.map((row) => row.stats[col]))
  );
  const average = STAT_ORDER.map((_, col) =>
    Math.round(
      statRows.reduce((sum, row) => sum + row.stats[col], 0) / statRows.length
    )
  );

  return (
    <div className="space-y-4">
      <Panel title="Verdict">
        <ul className="space-y-1.5 t-body">
          {notes.map((note) => (
            <li key={note} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-2 size-2 shrink-0 rotate-45 bg-pk-yellow"
              />
              {note}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Defensive profile">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {defence.map(({ type, weak, resist, immune }) => {
            const risky = weak > resist + immune && weak > 0;
            return (
              <li
                key={type}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border bg-white p-2',
                  risky ? 'border-pk-red ring-1 ring-pk-red' : 'border-pk-line'
                )}
              >
                <TypeIcon name={type} className="size-9 shrink-0" />
                <span className="t-small leading-tight">
                  <span
                    className={
                      weak ? 'font-bold text-pk-red' : 'text-pk-muted/70'
                    }
                  >
                    {weak} weak
                  </span>
                  <br />
                  <span
                    className={
                      resist + immune ? 'text-green-700' : 'text-pk-muted/70'
                    }
                  >
                    {resist + immune} resist
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 t-small text-pk-muted">
          Counts of team members. A red outline means that type hits more of
          your team than it resists.
        </p>
      </Panel>

      <Panel title="Offensive coverage">
        <p className="mb-3 t-small text-pk-muted">
          {usingMoves
            ? `Best damage any chosen damaging move deals to each type (${damagingTypes.map((t) => getDisplayName(t)).join(', ')}).`
            : 'No moves chosen yet, so this uses each member’s own types (STAB). Add moves for exact coverage.'}
        </p>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-9">
          {hits.map(({ type, best: value }) => (
            <li
              key={type}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-pk-line bg-white p-2"
            >
              <TypeIcon name={type} className="size-8" />
              <span
                className={cn(
                  'w-full rounded-md py-0.5 text-center t-body font-bold',
                  COVERAGE_TONE[value] ?? COVERAGE_TONE[1]
                )}
              >
                {value === 1 ? '·' : `×${formatMultiplier(value)}`}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Base stats">
        <div className="overflow-x-auto rounded-xl border border-pk-line bg-white">
          <table className="w-full min-w-[34rem] border-collapse text-right">
            <thead>
              <tr className="t-label text-pk-muted">
                <th className="px-3 py-2.5 text-left">Pokémon</th>
                {STAT_ORDER.map((key) => (
                  <th key={key} className="px-2 py-2.5">
                    {STAT_LABELS[key]}
                  </th>
                ))}
                <th className="px-3 py-2.5">Total</th>
              </tr>
            </thead>
            <tbody className="t-body">
              {statRows.map((row) => (
                <tr key={row.name} className="border-t border-pk-line">
                  <th className="px-3 py-1.5 text-left font-bold">
                    {getDisplayName(row.name)}
                  </th>
                  {row.stats.map((value, col) => (
                    <td
                      key={STAT_ORDER[col]}
                      className={cn(
                        'px-2 py-1.5',
                        value === best[col] && statRows.length > 1
                          ? 'font-bold text-pk-navy'
                          : 'text-pk-ink'
                      )}
                    >
                      {value}
                    </td>
                  ))}
                  <td className="px-3 py-1.5 font-bold">{row.total}</td>
                </tr>
              ))}
              {statRows.length > 1 && (
                <tr className="border-t-2 border-pk-line bg-pk-cream/50 text-pk-muted">
                  <th className="px-3 py-1.5 text-left font-bold">Average</th>
                  {average.map((value, col) => (
                    <td key={STAT_ORDER[col]} className="px-2 py-1.5">
                      {value}
                    </td>
                  ))}
                  <td className="px-3 py-1.5 font-bold">
                    {Math.round(
                      statRows.reduce((sum, row) => sum + row.total, 0) /
                        statRows.length
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 t-small text-pk-muted">
          The highest value in each column is shown in navy.
        </p>
      </Panel>
    </div>
  );
}
