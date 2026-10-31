import React from 'react';
import { Link, useParams } from 'react-router';
import { useSuspenseQueries } from '@tanstack/react-query';
import { apiQuery, pathFromUrl, useMove, useOptionalApi } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import DetailBanner from '../Components/DetailBanner';
import { DamageClassPill, effectText } from '../Components/MoveRow';
import LinkChips from '../Components/LinkChips';
import PokemonLinkGrid from '../Components/PokemonLinkGrid';
import TypeBadge from '../Components/TypeBadge';
import { Loading, Page, Panel, SelectBox, StatTile } from '../Components/ui';
import { moveHistory, moveValuesIn } from '../Utils/history';
import { useSelection } from '../Utils/selection';
import { STAT_LABELS } from '../Utils/stats';
import { typeColours } from '../Utils/typeColours';
import {
  compareVersionGroups,
  englishFlavorText,
  firstEnglish,
  formatGeneration,
  getDisplayName,
  versionGroupLabel,
} from '../Utils/text';
import type { ContestEffect, Machine, Move } from '../types/pokeapi';

const META_LABELS: [string, string, string][] = [
  ['crit_rate', 'Critical hit stage', ''],
  ['drain', 'Drain', '%'],
  ['healing', 'Healing', '%'],
  ['flinch_chance', 'Flinch chance', '%'],
  ['ailment_chance', 'Status chance', '%'],
  ['stat_chance', 'Stat change chance', '%'],
];

function range(min: number | null, max: number | null) {
  return min === max ? max : `${min}–${max}`;
}

/** Older values and effects, each listed against the game that changed them. */
function History({ move }: { move: Move }) {
  const rows = moveHistory(move);
  if (!rows.length && !move.effect_changes.length) return null;

  return (
    <Panel title="How it has changed" className="lg:col-span-2">
      <ul className="space-y-2 t-body">
        {rows.map((row) => (
          <li key={row.version_group.name}>
            <span className="t-small text-pk-muted">
              Before {versionGroupLabel(row.version_group.name)}:
            </span>{' '}
            {[
              row.power !== null && `Power ${row.power}`,
              row.accuracy !== null && `Accuracy ${row.accuracy}%`,
              row.pp !== null && `PP ${row.pp}`,
              row.effect_chance !== null &&
                `Effect chance ${row.effect_chance}%`,
              row.type && `${getDisplayName(row.type.name)} type`,
            ]
              .filter(Boolean)
              .join(', ')}
          </li>
        ))}
        {move.effect_changes.map((change) => (
          <li key={change.version_group.name}>
            <span className="t-small text-pk-muted">
              Before {versionGroupLabel(change.version_group.name)}:
            </span>{' '}
            {firstEnglish(change.effect_entries)?.effect}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function ContestPanel({ move }: { move: Move }) {
  const normal = useOptionalApi<ContestEffect>(
    move.contest_effect && pathFromUrl(move.contest_effect.url)
  );
  const superEffect = useOptionalApi<ContestEffect>(
    move.super_contest_effect && pathFromUrl(move.super_contest_effect.url)
  );
  if (!move.contest_type && !normal && !superEffect) return null;
  const combos = [
    ...(move.contest_combos?.normal.use_before ?? []),
    ...(move.contest_combos?.normal.use_after ?? []),
  ];

  return (
    <Panel title="Contests">
      {move.contest_type && (
        <Link
          to={`/guide/contest-type/${move.contest_type.name}`}
          className="t-body font-bold text-pk-navy underline underline-offset-2"
        >
          {getDisplayName(move.contest_type.name)}
        </Link>
      )}
      {normal && (
        <p className="mt-2 t-body">
          {firstEnglish(normal.flavor_text_entries)?.flavor_text}{' '}
          <span className="t-small text-pk-muted">
            Appeal {normal.appeal}, jam {normal.jam}
          </span>
        </p>
      )}
      {superEffect && (
        <p className="mt-2 t-body">
          <span className="t-small text-pk-muted">Super Contest: </span>
          {firstEnglish(superEffect.flavor_text_entries)?.flavor_text}{' '}
          <span className="t-small text-pk-muted">
            Appeal {superEffect.appeal}
          </span>
        </p>
      )}
      {combos.length > 0 && (
        <p className="mt-2 t-small text-pk-muted">
          Combos with{' '}
          {combos.map((combo, index) => (
            <span key={combo.name}>
              {index > 0 && ', '}
              <Link
                to={`/move/${combo.name}`}
                className="font-bold text-pk-navy underline-offset-2 hover:underline"
              >
                {getDisplayName(combo.name)}
              </Link>
            </span>
          ))}
        </p>
      )}
    </Panel>
  );
}

function MachinesPanel({ move }: { move: Move }) {
  const machines = useSuspenseQueries({
    queries: move.machines.map(({ machine }) =>
      apiQuery<Machine>(pathFromUrl(machine.url))
    ),
  }).map((result) => result.data);

  return (
    <Panel title="As a TM or HM">
      <ul className="grid gap-x-4 gap-y-0.5 t-small sm:grid-cols-2">
        {[...machines]
          .sort((a, b) =>
            compareVersionGroups(a.version_group.name, b.version_group.name)
          )
          .map((machine) => (
            <li
              key={machine.id}
              className="flex justify-between gap-3 leading-snug"
            >
              <Link
                to={`/game/${machine.version_group.name}`}
                className="underline-offset-2 hover:underline"
              >
                {versionGroupLabel(machine.version_group.name)}
              </Link>
              <Link
                to={`/item/${machine.item.name}`}
                className="font-bold text-pk-navy uppercase underline-offset-2 hover:underline"
              >
                {machine.item.name}
              </Link>
            </li>
          ))}
      </ul>
    </Panel>
  );
}

export default function MovePage() {
  const { name = '' } = useParams();
  const move = useMove(name);
  useDocumentTitle(getDisplayName(name));

  const { game } = useSelection();
  const values = moveValuesIn(move, game);
  const effect = firstEnglish(move.effect_entries);
  const flavour = React.useMemo(
    () => englishFlavorText(move.flavor_text_entries),
    [move]
  );
  const [group, setGroup] = React.useState(
    flavour.find((f) => f.version_group?.name === game)?.version_group?.name ??
      flavour.at(-1)?.version_group?.name ??
      ''
  );
  const flavourText = flavour.find((f) => f.version_group?.name === group);
  const meta = move.meta;
  const ailment =
    meta?.ailment.name !== 'none' ? meta?.ailment.name : undefined;
  const metaValues = meta as unknown as Record<string, number> | null;

  return (
    <Page>
      <DetailBanner
        back="/moves"
        colour={typeColours[values.type.name]}
        eyebrow={
          <>
            Move ·{' '}
            <Link
              to={`/generation/${move.generation.name}`}
              className="underline underline-offset-2"
            >
              {formatGeneration(move.generation.name)}
            </Link>
          </>
        }
        title={getDisplayName(name)}
        badges={
          <>
            <TypeBadge name={values.type.name} size="lg" icon />
            <Link to={`/guide/move-damage-class/${move.damage_class.name}`}>
              <DamageClassPill name={move.damage_class.name} />
            </Link>
          </>
        }
      />

      <dl className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile label="Power" value={values.power ?? '—'} />
        <StatTile
          label="Accuracy"
          value={values.accuracy ? `${values.accuracy}%` : '—'}
        />
        <StatTile label="PP" value={values.pp ?? '—'} />
        <StatTile
          label="Priority"
          value={move.priority > 0 ? `+${move.priority}` : move.priority}
        />
        <StatTile
          label="Target"
          value={
            <Link
              to={`/guide/move-target/${move.target.name}`}
              className="t-body"
            >
              {getDisplayName(move.target.name)}
            </Link>
          }
        />
        <StatTile
          label="Effect chance"
          value={values.effect_chance ? `${values.effect_chance}%` : '—'}
        />
      </dl>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Panel title="What it does">
          <p className="t-body">
            {effect
              ? effectText(effect.effect, values.effect_chance)
              : 'No description available.'}
          </p>
          {ailment && (
            <p className="mt-3 t-small text-pk-muted">
              Can cause{' '}
              <Link
                to={`/guide/move-ailment/${ailment}`}
                className="font-bold text-pk-navy underline underline-offset-2"
              >
                {getDisplayName(ailment)}
              </Link>
              .
            </p>
          )}
          {meta && (
            <ul className="mt-4 flex flex-wrap gap-2 t-small">
              {META_LABELS.filter(([key]) => (metaValues?.[key] ?? 0) > 0).map(
                ([key, label, unit]) => (
                  <li
                    key={key}
                    className="rounded-lg border border-pk-line bg-white px-3 py-1"
                  >
                    {label}:{' '}
                    <strong>
                      {metaValues?.[key]}
                      {unit}
                    </strong>
                  </li>
                )
              )}
              {meta.max_hits ? (
                <li className="rounded-lg border border-pk-line bg-white px-3 py-1">
                  Hits: <strong>{range(meta.min_hits, meta.max_hits)}</strong>
                </li>
              ) : null}
              {meta.max_turns ? (
                <li className="rounded-lg border border-pk-line bg-white px-3 py-1">
                  Turns:{' '}
                  <strong>{range(meta.min_turns, meta.max_turns)}</strong>
                </li>
              ) : null}
            </ul>
          )}
        </Panel>

        {flavour.length > 0 && (
          <Panel
            title="In-game text"
            actions={
              <SelectBox
                label="Game"
                value={group}
                onChange={setGroup}
                className="w-56"
              >
                {flavour.map((f) => (
                  <option
                    key={f.version_group?.name}
                    value={f.version_group?.name}
                  >
                    {versionGroupLabel(f.version_group?.name ?? '')}
                  </option>
                ))}
              </SelectBox>
            }
          >
            <p className="t-body">{flavourText?.flavor_text}</p>
          </Panel>
        )}
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        {move.stat_changes.length > 0 && (
          <Panel title="Stat changes">
            <LinkChips
              items={move.stat_changes.map(({ change, stat }) => ({
                to: `/guide/stat/${stat.name}`,
                label: `${STAT_LABELS[stat.name] ?? getDisplayName(stat.name)} ${change > 0 ? '+' : ''}${change}`,
              }))}
            />
          </Panel>
        )}
        {meta && (
          <Panel title="Category">
            <LinkChips
              items={[
                {
                  to: `/guide/move-category/${meta.category.name}`,
                  label: getDisplayName(meta.category.name),
                },
              ]}
            />
          </Panel>
        )}
        <React.Suspense fallback={<Loading className="h-24" />}>
          <ContestPanel move={move} />
        </React.Suspense>
        {move.machines.length > 0 && (
          <React.Suspense fallback={<Loading className="h-24" />}>
            <MachinesPanel move={move} />
          </React.Suspense>
        )}
        <History move={move} />
      </div>

      <Panel
        title={`Learned by ${move.learned_by_pokemon.length} Pokémon`}
        actions={
          <Link
            to={`/moves?type=${move.type.name}`}
            className="t-small font-bold text-pk-red underline underline-offset-2"
          >
            More {getDisplayName(move.type.name)} moves
          </Link>
        }
      >
        <PokemonLinkGrid
          items={move.learned_by_pokemon.map((pokemon) => ({ pokemon }))}
          emptyTitle="No Pokémon learn this move"
        />
      </Panel>
    </Page>
  );
}
