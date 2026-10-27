import React from 'react';
import { useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
import { apiQuery, useApi, useRegionData } from '../api/pokeapi';
import { DEFAULT_DEX } from '../Utils/dex';
import { generationNumber } from '../Utils/games';
import { useSelection } from '../Utils/selection';
import {
  compareVersionGroups,
  formatGeneration,
  getDisplayName,
  getPokedexLabel,
  versionGroupLabel,
} from '../Utils/text';
import { cn } from '../Utils/cn';
import { ChevronDownIcon, PokeballIcon } from './Icons';
import { Loading, Modal, buttonClass } from './ui';
import type { NamedAPIResourceList, VersionGroup } from '../types/pokeapi';

export const dexLabel = (dex: string) =>
  dex === DEFAULT_DEX ? 'National' : getDisplayName(dex);

function Choice({
  current,
  onClick,
  children,
}: {
  current: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={current}
      onClick={onClick}
      className={cn(
        'inline-flex h-10 items-center rounded-full px-4 t-small font-bold ds-key transition',
        current
          ? 'ds-gloss text-white ds-text-dark'
          : 'ds-gloss-silver hover:brightness-105'
      )}
    >
      {children}
    </button>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2.5 flex items-center gap-2.5 t-h3">
      <span aria-hidden="true" className="size-2.5 rotate-45 bg-pk-yellow" />
      {children}
    </h3>
  );
}

function RegionCard({ name }: { name: string }) {
  const { dex, chooseDex, closeSelector } = useSelection();
  const region = useRegionData(name);
  if (!region.pokedexes.length) return null; // e.g. Orre has no Pokédex yet

  return (
    <section className="ds-frame p-4">
      <h4 className="mb-3 t-body font-bold">{getDisplayName(name)}</h4>
      <div className="flex flex-wrap gap-2">
        {region.pokedexes.map((entry) => (
          <Choice
            key={entry.name}
            current={entry.name === dex}
            onClick={() => {
              chooseDex(entry.name);
              closeSelector();
            }}
          >
            {getPokedexLabel(entry.name, name)
              .toLowerCase()
              .replace(/^./, (c) => c.toUpperCase())}
          </Choice>
        ))}
      </div>
    </section>
  );
}

function SelectorContent() {
  const { game, dex, chooseGame, chooseDex, closeSelector } = useSelection();
  const list = useApi<NamedAPIResourceList>('version-group?limit=50');
  const regions = useApi<NamedAPIResourceList>('region?limit=100');
  const groups = useSuspenseQueries({
    queries: list.results.map((g) =>
      apiQuery<VersionGroup>(`version-group/${g.name}`)
    ),
  }).map((result) => result.data);

  // oldest first, grouped under their generation
  const byGeneration = React.useMemo(() => {
    const sorted = [...groups].sort((a, b) =>
      compareVersionGroups(a.name, b.name)
    );
    const map = new Map<number, VersionGroup[]>();
    for (const group of sorted) {
      const number = generationNumber(group.generation.name);
      map.set(number, [...(map.get(number) ?? []), group]);
    }
    return [...map.entries()].sort(([a], [b]) => a - b);
  }, [groups]);

  const current = groups.find((g) => g.name === game);
  const gameDexes = current?.pokedexes ?? [];

  return (
    <div className="space-y-6">
      <p className="t-body text-pk-muted">
        Moves, locations, Pokédex entries, types and the team planner follow the
        game you pick. It is remembered until you close the tab.
      </p>

      <section>
        <Heading>Game</Heading>
        <div className="mb-4">
          <Choice current={game === null} onClick={() => chooseGame(null)}>
            All games
          </Choice>
        </div>
        <div className="space-y-4">
          {byGeneration.map(([number, items]) => (
            <div key={number}>
              <p className="mb-1.5 t-label text-pk-muted">
                {formatGeneration(items[0].generation.name)}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <Choice
                    key={item.name}
                    current={item.name === game}
                    onClick={() =>
                      chooseGame(item.name, item.pokedexes[0]?.name)
                    }
                  >
                    {versionGroupLabel(item.name)}
                  </Choice>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Heading>Pokédex</Heading>
        <div className="flex flex-wrap gap-2">
          <Choice
            current={dex === DEFAULT_DEX}
            onClick={() => {
              chooseDex(DEFAULT_DEX);
              closeSelector();
            }}
          >
            National
          </Choice>
          {gameDexes.map((entry) => (
            <Choice
              key={entry.name}
              current={entry.name === dex}
              onClick={() => {
                chooseDex(entry.name);
                closeSelector();
              }}
            >
              {dexLabel(entry.name)}
            </Choice>
          ))}
        </div>
        {game && !gameDexes.length && (
          <p className="mt-2 t-small text-pk-muted">
            {versionGroupLabel(game)} has no Pokédex of its own, so the National
            one is used.
          </p>
        )}
        <details className="mt-4">
          <summary className="cursor-pointer t-body font-bold text-pk-navy">
            Browse every regional Pokédex
          </summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {regions.results.map((region) => (
              <RegionCard key={region.name} name={region.name} />
            ))}
          </div>
        </details>
      </section>

      <button
        type="button"
        onClick={closeSelector}
        className={buttonClass('accent', 'md', 'w-full')}
      >
        Done
      </button>
    </div>
  );
}

/** The dialog behind the header button; mounted once in the app shell. */
export function GameSelectorModal() {
  const { selectorOpen, closeSelector } = useSelection();
  return (
    <Modal open={selectorOpen} onClose={closeSelector} label="Game & Pokédex">
      <React.Suspense fallback={<Loading />}>
        <SelectorContent />
      </React.Suspense>
    </Modal>
  );
}

/** Shows the current game and Pokédex; opens the dialog. */
export function GameSelectorButton({ className }: { className?: string }) {
  const { game, dex, openSelector } = useSelection();
  const queryClient = useQueryClient();

  // the dialog lists every game, so start loading them as the button is reached
  function warm() {
    void queryClient
      .fetchQuery(apiQuery<NamedAPIResourceList>('version-group?limit=50'))
      .then((list) =>
        list.results.forEach((g) =>
          queryClient.prefetchQuery(
            apiQuery<VersionGroup>(`version-group/${g.name}`)
          )
        )
      )
      .catch(() => undefined);
  }

  return (
    <button
      type="button"
      onClick={openSelector}
      onPointerEnter={warm}
      onFocus={warm}
      onTouchStart={warm}
      aria-haspopup="dialog"
      aria-label={`Game and Pokédex: ${game ? versionGroupLabel(game) : 'All games'}, ${dexLabel(dex)}. Change`}
      className={cn(
        'flex h-11 min-w-0 items-center gap-2 rounded-full ds-gloss-yellow px-3.5 text-left text-pk-navy ds-key transition hover:brightness-105',
        className
      )}
    >
      <PokeballIcon className="size-5 shrink-0" />
      <span className="min-w-0 flex-1 leading-none">
        <span className="block truncate t-label font-bold">
          {game ? versionGroupLabel(game) : 'All games'}
        </span>
        <span className="block truncate t-label opacity-70">
          {dexLabel(dex)}
        </span>
      </span>
      <ChevronDownIcon className="size-4 shrink-0" />
    </button>
  );
}
