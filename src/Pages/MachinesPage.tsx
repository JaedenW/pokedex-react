import React from 'react';
import { Link } from 'react-router';
import { useQueries } from '@tanstack/react-query';
import {
  apiQuery,
  pathFromUrl,
  useApi,
  useVersionGroups,
} from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import MoveRowList from '../Components/MoveRowList';
import PageHeader from '../Components/PageHeader';
import SectionTabs, { MOVE_TABS } from '../Components/SectionTabs';
import {
  EmptyState,
  Loading,
  Page,
  Panel,
  SearchInput,
  SelectBox,
  buttonClass,
} from '../Components/ui';
import { DEFAULT_GAME } from '../Utils/games';
import { useSelection } from '../Utils/selection';
import { rankMatch } from '../Utils/search';
import { compareVersionGroups, versionGroupLabel } from '../Utils/text';
import type { Item, ItemCategory, Machine } from '../types/pokeapi';

const KIND_ORDER: Record<string, number> = { tm: 0, tr: 1, hm: 2 };

/** "tm24" -> [0, 24], so TMs sort by number and come before HMs. */
function machineOrder(item: string) {
  const [, kind = '', number = '0'] = /^([a-z]+)(\d+)$/.exec(item) ?? [];
  return [KIND_ORDER[kind] ?? 3, Number(number)] as const;
}

/**
 * PokeAPI can't list a game's machines directly: each machine item says which
 * record applies per game, and that record names the move.
 */
function useGameMachines(game: string) {
  const category = useApi<ItemCategory>('item-category/all-machines');
  const items = useQueries({
    queries: category.items.map((item) => apiQuery<Item>(`item/${item.name}`)),
  });
  const references = items.flatMap((result) =>
    (result.data?.machines ?? []).filter(
      (machine) => machine.version_group.name === game
    )
  );
  const machines = useQueries({
    queries: references.map((reference) =>
      apiQuery<Machine>(pathFromUrl(reference.machine.url))
    ),
  });

  const done =
    items.filter((r) => !r.isPending).length +
    machines.filter((r) => !r.isPending).length;
  const total = items.length + references.length;
  const loaded = machines.flatMap((r) => (r.data ? [r.data] : []));
  const failed = [...items, ...machines].filter((r) => r.isError);

  return {
    done,
    total,
    ready: done === total,
    machines: loaded,
    failed: failed.length,
    retry: () => failed.forEach((r) => void r.refetch()),
  };
}

function MachineList({ game, query }: { game: string; query: string }) {
  const { done, total, ready, machines, failed, retry } = useGameMachines(game);

  const rows = React.useMemo(
    () =>
      [...machines]
        .sort((a, b) => {
          const [kindA, numberA] = machineOrder(a.item.name);
          const [kindB, numberB] = machineOrder(b.item.name);
          return kindA - kindB || numberA - numberB;
        })
        .filter(
          (machine) =>
            !query ||
            rankMatch(query, machine.move.name) !== Infinity ||
            rankMatch(query, machine.item.name) !== Infinity
        )
        .map((machine) => ({
          name: machine.move.name,
          label: machine.item.name,
        })),
    [machines, query]
  );

  if (!ready) {
    return (
      <div className="ds-frame p-5 text-center">
        <Loading className="h-24" />
        <p className="t-body text-pk-muted">
          Looking up this game’s machines: {done} of {total}
        </p>
      </div>
    );
  }

  const warning = failed > 0 && (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 ds-frame px-4 py-3">
      <p className="t-body">
        This list is incomplete: {failed} lookups failed.
      </p>
      <button
        type="button"
        onClick={retry}
        className={buttonClass('secondary', 'sm')}
      >
        Try again
      </button>
    </div>
  );

  if (!machines.length) {
    if (warning) return warning;
    return (
      <EmptyState title="No machines are recorded for this game">
        <Link to="/games" className="underline underline-offset-2">
          Try another game
        </Link>
      </EmptyState>
    );
  }

  return (
    <>
      {warning}
      <MoveRowList
        items={rows}
        resetKey={`${game}|${query}`}
        emptyTitle="No machines match"
      />
    </>
  );
}

export default function MachinesPage() {
  useDocumentTitle('TMs & HMs');
  const selection = useSelection();
  const game = selection.game ?? DEFAULT_GAME;
  const groups = useVersionGroups();
  const [query, setQuery] = React.useState('');
  const deferred = React.useDeferredValue(query);
  const games = React.useMemo(
    () => groups.results.map((g) => g.name).sort(compareVersionGroups),
    [groups]
  );

  return (
    <Page>
      <PageHeader
        title="TMs & HMs"
        subtitle={`The machines in ${versionGroupLabel(game)}`}
      />
      <SectionTabs tabs={MOVE_TABS} />
      <Panel className="mb-5">
        <div className="flex flex-wrap gap-3">
          <SearchInput
            label="Filter machines"
            placeholder="Filter by move or TM number…"
            value={query}
            onChange={setQuery}
            className="min-w-52 flex-1"
          />
          <SelectBox
            label="Game"
            value={game}
            onChange={(value) => void selection.chooseGame(value)}
            className="w-64"
          >
            {games.map((name) => (
              <option key={name} value={name}>
                {versionGroupLabel(name)}
              </option>
            ))}
          </SelectBox>
        </div>
      </Panel>
      <MachineList key={game} game={game} query={deferred} />
    </Page>
  );
}
