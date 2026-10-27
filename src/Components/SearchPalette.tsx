import React from 'react';
import { useNavigate } from 'react-router';
import {
  abilityIndexPath,
  idFromUrl,
  itemIndexPath,
  moveIndexPath,
  speciesIndexPath,
  useApiQuery,
} from '../api/pokeapi';
import { itemSpriteUrl, pokemonSpriteUrl, typeIconUrl } from '../api/sprites';
import { useSearch } from '../Utils/SearchContext';
import { rankMatch, searchNames } from '../Utils/search';
import { TYPES } from '../Utils/typeChart';
import { formatDexNumber, getDisplayName } from '../Utils/text';
import { cn } from '../Utils/cn';
import { BoltIcon, CloseIcon, SearchIcon } from './Icons';
import type { NamedAPIResourceList } from '../types/pokeapi';

type Kind = 'pokemon' | 'move' | 'ability' | 'item' | 'type' | 'link';

interface Result {
  kind: Kind;
  name: string;
  label: string;
  to: string;
  image?: string;
  hint?: string;
}

const KIND_LABEL: Record<Kind, string> = {
  pokemon: 'Pokémon',
  move: 'Moves',
  ability: 'Abilities',
  item: 'Items',
  type: 'Types',
  link: 'Go to',
};

const QUICK_LINKS: Result[] = [
  { kind: 'link', name: 'dex', label: 'Pokédex', to: '/' },
  { kind: 'link', name: 'moves', label: 'Moves', to: '/moves' },
  { kind: 'link', name: 'abilities', label: 'Abilities', to: '/abilities' },
  { kind: 'link', name: 'items', label: 'Items', to: '/items' },
  { kind: 'link', name: 'types', label: 'Type chart', to: '/types' },
  { kind: 'link', name: 'team', label: 'Team planner', to: '/team' },
];

function ResultIcon({ result }: { result: Result }) {
  if (result.image) {
    return (
      <img
        src={result.image}
        alt=""
        className={cn(
          'size-11 shrink-0 object-contain',
          result.kind !== 'type' && '[image-rendering:pixelated]'
        )}
      />
    );
  }
  return (
    <span className="flex size-11 shrink-0 items-center justify-center text-pk-muted/70">
      {result.kind === 'move' || result.kind === 'ability' ? (
        <BoltIcon className="size-5" />
      ) : (
        <SearchIcon className="size-5" />
      )}
    </span>
  );
}

export default function SearchPalette() {
  const { isOpen, openSearch, closeSearch } = useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const species = useApiQuery<NamedAPIResourceList>(speciesIndexPath, isOpen);
  const moves = useApiQuery<NamedAPIResourceList>(moveIndexPath, isOpen);
  const abilities = useApiQuery<NamedAPIResourceList>(abilityIndexPath, isOpen);
  const items = useApiQuery<NamedAPIResourceList>(itemIndexPath, isOpen);
  const loading = species.isLoading || moves.isLoading;

  // Ctrl/⌘ + K toggles; "/" opens when you're not typing somewhere
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      const typing =
        /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) ||
        target.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (isOpen) closeSearch();
        else openSearch();
      } else if (event.key === '/' && !typing && !isOpen) {
        event.preventDefault();
        openSearch();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, openSearch, closeSearch]);

  React.useEffect(() => {
    if (isOpen) inputRef.current?.focus();
    else setQuery('');
  }, [isOpen]);

  const speciesIds = React.useMemo(
    () =>
      new Map(
        species.data?.results.map((s) => [s.name, idFromUrl(s.url)]) ?? []
      ),
    [species.data]
  );

  const toResult = React.useCallback(
    (kind: Exclude<Kind, 'link'>, name: string): Result => ({
      kind,
      name,
      label: getDisplayName(name),
      to: `/${kind}/${name}`,
      image:
        kind === 'pokemon' && speciesIds.has(name)
          ? pokemonSpriteUrl(speciesIds.get(name)!)
          : kind === 'item'
            ? itemSpriteUrl(name)
            : kind === 'type'
              ? typeIconUrl(name)
              : undefined,
      hint:
        kind === 'pokemon' && speciesIds.has(name)
          ? formatDexNumber(speciesIds.get(name)!)
          : undefined,
    }),
    [speciesIds]
  );

  const results = React.useMemo<Result[]>(() => {
    const q = query.trim();
    if (!q) return QUICK_LINKS;
    const found: Result[] = [];
    if (/^\d+$/.test(q) && species.data) {
      const match = species.data.results.find(
        (s) => idFromUrl(s.url) === Number(q)
      );
      if (match) found.push(toResult('pokemon', match.name));
    }
    const add = (
      kind: Exclude<Kind, 'link'>,
      list: { name: string }[],
      limit: number
    ) =>
      searchNames(q, list, limit).forEach((entry) => {
        if (!found.some((f) => f.kind === kind && f.name === entry.name)) {
          found.push(toResult(kind, entry.name));
        }
      });
    add('pokemon', species.data?.results ?? [], 8);
    add(
      'type',
      TYPES.filter((t) => rankMatch(q, t) !== Infinity).map((name) => ({
        name,
      })),
      3
    );
    add('move', moves.data?.results ?? [], 5);
    add('ability', abilities.data?.results ?? [], 4);
    add('item', items.data?.results ?? [], 5);
    return found;
  }, [query, species.data, moves.data, abilities.data, items.data, toResult]);

  React.useEffect(() => setActive(0), [query]);

  React.useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  function choose(result: Result) {
    closeSearch();
    navigate(result.to);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      closeSearch();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && results[active]) {
      event.preventDefault();
      choose(results[active]);
    }
  }

  if (!isOpen) return null;

  const hasQuery = query.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-[60] bg-pk-navy-deep/60 backdrop-blur-sm"
      onMouseDown={closeSearch}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
        className="flex h-full flex-col bg-pk-cream sm:mx-auto sm:mt-[8vh] sm:h-auto sm:max-h-[78vh] sm:max-w-xl sm:overflow-hidden sm:rounded-xl sm:shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b-4 border-pk-yellow bg-pk-navy p-3">
          <SearchIcon className="ml-1 size-6 shrink-0 text-white/70" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Pokémon, moves, items, types…"
            aria-label="Search"
            aria-controls="search-results"
            aria-activedescendant={
              results[active] ? `result-${active}` : undefined
            }
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="go"
            className="h-12 min-w-0 flex-1 rounded-xl bg-white px-4 text-pk-ink placeholder:text-pk-muted/70 focus:outline-none"
          />
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/15"
          >
            <CloseIcon />
          </button>
        </div>

        <ul
          id="search-results"
          ref={listRef}
          role="listbox"
          className="flex-1 overflow-y-auto overscroll-contain p-2"
        >
          {loading && hasQuery && (
            <li className="p-4 text-center t-body text-pk-muted">Loading…</li>
          )}
          {!loading && hasQuery && results.length === 0 && (
            <li className="p-6 text-center t-body text-pk-muted">
              Nothing found for “{query.trim()}”.
            </li>
          )}
          {results.map((result, index) => {
            const showHeader =
              index === 0 || results[index - 1].kind !== result.kind;
            return (
              <React.Fragment key={`${result.kind}-${result.name}`}>
                {showHeader && (
                  <li
                    role="presentation"
                    className="px-2 pt-3 pb-1.5 t-label text-pk-muted"
                  >
                    {KIND_LABEL[result.kind]}
                  </li>
                )}
                <li
                  id={`result-${index}`}
                  role="option"
                  aria-selected={index === active}
                  onMouseMove={() => setActive(index)}
                  onClick={() => choose(result)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1',
                    index === active ? 'bg-pk-yellow' : 'hover:bg-white'
                  )}
                >
                  <ResultIcon result={result} />
                  <span className="min-w-0 flex-1 truncate t-body font-bold">
                    {result.label}
                  </span>
                  {result.hint && (
                    <span className="t-small text-pk-navy/70">
                      {result.hint}
                    </span>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ul>

        <p className="hidden border-t border-pk-line bg-pk-paper px-4 py-2 t-small text-pk-muted sm:block">
          ↑ ↓ to move · Enter to open · Esc to close
        </p>
      </div>
    </div>
  );
}
