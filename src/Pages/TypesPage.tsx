import React from 'react';
import { Link } from 'react-router';
import { useSuspenseQueries } from '@tanstack/react-query';
import { apiQuery } from '../api/pokeapi';
import { typeIconUrl } from '../api/sprites';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import PageHeader from '../Components/PageHeader';
import TypeBadge from '../Components/TypeBadge';
import TypeDefenses from '../Components/pokemon/TypeDefenses';
import { Chip, Loading, Page, Panel } from '../Components/ui';
import { TYPES, attackMultiplier } from '../Utils/typeChart';
import { typeColours } from '../Utils/typeColours';
import { getDisplayName } from '../Utils/text';
import { cn } from '../Utils/cn';
import type { Type } from '../types/pokeapi';

const CELL: Record<number, { text: string; tone: string }> = {
  2: { text: '2', tone: 'bg-green-500 text-white' },
  0.5: { text: '½', tone: 'bg-red-400 text-white' },
  0: { text: '0', tone: 'bg-pk-ink text-white' },
};

function TypeIcon({ name, className }: { name: string; className?: string }) {
  return (
    <span
      title={getDisplayName(name)}
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        className
      )}
      style={{ backgroundColor: typeColours[name] }}
    >
      <img
        src={typeIconUrl(name)}
        alt={getDisplayName(name)}
        className="size-full"
        loading="lazy"
      />
    </span>
  );
}

function Chart() {
  const results = useSuspenseQueries({
    queries: TYPES.map((type) => apiQuery<Type>(`type/${type}`)),
  });
  const relations = Object.fromEntries(
    TYPES.map((type, index) => [type, results[index].data.damage_relations])
  );
  const [focus, setFocus] = React.useState<{
    attacker?: string;
    defender?: string;
  }>({});

  return (
    <div>
      <div
        className="max-h-[75vh] overflow-auto rounded-xl border border-pk-line bg-white"
        onMouseLeave={() => setFocus({})}
      >
        <table className="border-separate border-spacing-0 text-center">
          <thead>
            <tr>
              <th className="sticky top-0 left-0 z-20 bg-white p-1.5 t-label leading-tight text-pk-muted">
                ATK ↓ DEF →
              </th>
              {TYPES.map((defender) => (
                <th
                  key={defender}
                  className={cn(
                    'sticky top-0 z-10 bg-white p-1.5',
                    focus.defender === defender && 'bg-pk-yellow'
                  )}
                >
                  <Link
                    to={`/type/${defender}`}
                    aria-label={getDisplayName(defender)}
                  >
                    <TypeIcon name={defender} className="size-8" />
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TYPES.map((attacker) => (
              <tr key={attacker}>
                <th
                  scope="row"
                  className={cn(
                    'sticky left-0 z-10 bg-white p-1.5',
                    focus.attacker === attacker && 'bg-pk-yellow'
                  )}
                >
                  <Link
                    to={`/type/${attacker}`}
                    aria-label={getDisplayName(attacker)}
                  >
                    <TypeIcon name={attacker} className="size-8" />
                  </Link>
                </th>
                {TYPES.map((defender) => {
                  const multiplier = attackMultiplier(
                    relations[attacker],
                    defender
                  );
                  const cell = CELL[multiplier];
                  const highlighted =
                    focus.attacker === attacker || focus.defender === defender;
                  return (
                    <td
                      key={defender}
                      onMouseEnter={() => setFocus({ attacker, defender })}
                      title={`${getDisplayName(attacker)} → ${getDisplayName(defender)}: ×${multiplier}`}
                      className={cn(
                        'size-10 min-w-10 border border-white t-body font-bold',
                        cell?.tone ??
                          (highlighted ? 'bg-pk-yellow/30' : 'bg-pk-paper')
                      )}
                    >
                      {cell?.text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 t-small text-pk-muted">
        <span>
          <b className="rounded bg-green-500 px-2 text-white">2</b> super
          effective
        </span>
        <span>
          <b className="rounded bg-red-400 px-2 text-white">½</b> not very
          effective
        </span>
        <span>
          <b className="rounded bg-pk-ink px-2 text-white">0</b> no effect
        </span>
      </p>
    </div>
  );
}

function Calculator() {
  const [selected, setSelected] = React.useState<string[]>(['water', 'flying']);

  function toggle(type: string) {
    setSelected((current) =>
      current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type].slice(-2)
    );
  }

  return (
    <div>
      <p className="mb-3 t-body text-pk-muted">
        Pick one or two types to see what hits a Pokémon with them hardest.
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {TYPES.map((type) => (
          <Chip
            key={type}
            active={selected.includes(type)}
            colour={typeColours[type]}
            onClick={() => toggle(type)}
          >
            {getDisplayName(type)}
          </Chip>
        ))}
      </div>
      {selected.length ? (
        <React.Suspense fallback={<Loading className="h-24" />}>
          <TypeDefenses types={selected} />
        </React.Suspense>
      ) : (
        <p className="t-body text-pk-muted">Select a type to begin.</p>
      )}
    </div>
  );
}

export default function TypesPage() {
  useDocumentTitle('Types');

  return (
    <Page>
      <PageHeader title="Types" subtitle="Who beats what" />

      <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6">
        {TYPES.map((type) => (
          <Link
            key={type}
            to={`/type/${type}`}
            className="flex flex-col items-center gap-2 ds-frame ds-frame-hover p-4 transition motion-safe:hover:-translate-y-0.5"
          >
            <TypeIcon name={type} className="size-14" />
            <TypeBadge name={type} linked={false} size="sm" />
          </Link>
        ))}
      </div>

      <div className="space-y-4">
        <Panel title="Defence calculator">
          <Calculator />
        </Panel>
        <Panel title="Effectiveness chart">
          <React.Suspense fallback={<Loading />}>
            <Chart />
          </React.Suspense>
        </Panel>
      </div>
    </Page>
  );
}
