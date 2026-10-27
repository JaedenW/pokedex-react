import React from 'react';
import {
  idFromUrl,
  speciesIndexPath,
  useApi,
  useMove,
} from '../../api/pokeapi';
import { pokemonSpriteUrl } from '../../api/sprites';
import { rankMatch, searchNames } from '../../Utils/search';
import { formatDexNumber, getDisplayName } from '../../Utils/text';
import { cn } from '../../Utils/cn';
import { DamageClassPill } from '../MoveRow';
import TypeBadge from '../TypeBadge';
import { CloseIcon } from '../Icons';
import { EmptyState, Loading, Modal, SearchInput, buttonClass } from '../ui';
import type { NamedAPIResourceList, Pokemon } from '../../types/pokeapi';

/* ---------- choosing a Pokémon ---------- */

function PokemonResults({
  roster,
  taken,
  onPick,
}: {
  roster: Set<string> | null;
  taken: string[];
  onPick: (name: string) => void;
}) {
  const index = useApi<NamedAPIResourceList>(speciesIndexPath);
  const [query, setQuery] = React.useState('');

  const available = React.useMemo(
    () => index.results.filter((s) => !roster || roster.has(s.name)),
    [index, roster]
  );
  const results = query.trim()
    ? searchNames(query, available, 24)
    : available.slice(0, 24);

  return (
    <>
      <SearchInput
        label="Find a Pokémon"
        placeholder={
          roster
            ? `Search ${available.length} Pokémon in this game…`
            : 'Search Pokémon…'
        }
        value={query}
        onChange={setQuery}
        className="mb-4"
      />
      {results.length ? (
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {results.map((species) => {
            const inTeam = taken.includes(species.name);
            return (
              <li key={species.name}>
                <button
                  type="button"
                  disabled={inTeam}
                  onClick={() => onPick(species.name)}
                  className="flex w-full items-center gap-3 rounded-xl border border-pk-line bg-white px-2 py-1 text-left transition hover:border-pk-navy disabled:opacity-40"
                >
                  <img
                    src={pokemonSpriteUrl(idFromUrl(species.url))}
                    alt=""
                    className="size-12 [image-rendering:pixelated]"
                  />
                  <span className="flex-1 truncate t-body font-bold">
                    {getDisplayName(species.name)}
                  </span>
                  <span className="t-small text-pk-muted">
                    {inTeam
                      ? 'In team'
                      : formatDexNumber(idFromUrl(species.url))}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState title="Nothing found" />
      )}
    </>
  );
}

export function PokemonPicker({
  open,
  onClose,
  roster,
  taken,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  roster: Set<string> | null;
  taken: string[];
  onPick: (name: string) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} label="Add a Pokémon">
      <React.Suspense fallback={<Loading />}>
        <PokemonResults roster={roster} taken={taken} onPick={onPick} />
      </React.Suspense>
    </Modal>
  );
}

/* ---------- choosing moves ---------- */

function MovePickRow({
  name,
  selected,
  onPick,
}: {
  name: string;
  selected: boolean;
  onPick: () => void;
}) {
  const move = useMove(name);
  return (
    <li>
      <button
        type="button"
        disabled={selected}
        onClick={onPick}
        className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-pk-line bg-white px-3 py-2 text-left transition hover:border-pk-navy disabled:opacity-40"
      >
        <span className="min-w-0 flex-1 t-body leading-tight font-bold">
          {getDisplayName(name)}
        </span>
        <TypeBadge name={move.type.name} size="sm" linked={false} />
        <DamageClassPill name={move.damage_class.name} />
        <span className="w-20 text-right t-small text-pk-muted">
          {move.power ? `${move.power} pow` : '—'}
          {move.accuracy ? ` · ${move.accuracy}` : ''}
        </span>
      </button>
    </li>
  );
}

const MOVE_BATCH = 30;

export function MovePicker({
  open,
  onClose,
  pokemon,
  game,
  selected,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  pokemon: Pokemon;
  game: string;
  selected: string[];
  onPick: (move: string) => void;
}) {
  const [query, setQuery] = React.useState('');
  const [count, setCount] = React.useState(MOVE_BATCH);

  // every move it can know in this game
  const learnable = React.useMemo(
    () =>
      [
        ...new Set(
          pokemon.moves
            .filter((m) =>
              m.version_group_details.some((d) => d.version_group.name === game)
            )
            .map((m) => m.move.name)
        ),
      ].sort(),
    [pokemon, game]
  );
  const shown = learnable.filter(
    (name) => !query || rankMatch(query, name) !== Infinity
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      label={`Moves for ${getDisplayName(pokemon.name)}`}
    >
      {learnable.length ? (
        <>
          <SearchInput
            label="Filter moves"
            placeholder={`Search ${learnable.length} moves…`}
            value={query}
            onChange={(value) => {
              setQuery(value);
              setCount(MOVE_BATCH);
            }}
            className="mb-4"
          />
          <ul className="space-y-1.5">
            {shown.slice(0, count).map((name) => (
              <React.Suspense
                key={name}
                fallback={
                  <li className="h-14 animate-pulse rounded-xl bg-pk-line/50" />
                }
              >
                <MovePickRow
                  name={name}
                  selected={selected.includes(name)}
                  onPick={() => onPick(name)}
                />
              </React.Suspense>
            ))}
          </ul>
          {count < shown.length && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setCount((c) => c + MOVE_BATCH)}
                className={buttonClass('primary', 'md')}
              >
                Show more ({shown.length - count} left)
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState title="No moves recorded">
          PokeAPI has no moves for this Pokémon in this game.
        </EmptyState>
      )}
    </Modal>
  );
}

/** A chosen move, coloured by type, with a button to remove it. */
export function MoveChip({
  name,
  onRemove,
}: {
  name: string;
  onRemove: () => void;
}) {
  const move = useMove(name);
  return (
    <div className="flex items-center gap-2 rounded-xl border border-pk-line bg-white py-1.5 pr-1.5 pl-3">
      <TypeBadge name={move.type.name} size="sm" linked={false} />
      <span className="min-w-0 flex-1 truncate t-small font-bold">
        {getDisplayName(name)}
      </span>
      <span className="t-label text-pk-muted">
        {move.power
          ? move.power
          : move.damage_class.name === 'status'
            ? ''
            : '—'}
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${getDisplayName(name)}`}
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full text-pk-muted transition hover:bg-pk-red hover:text-white'
        )}
      >
        <CloseIcon className="size-4" />
      </button>
    </div>
  );
}
