import React from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useSuspenseQueries } from '@tanstack/react-query';
import { apiQuery, idFromUrl, usePokedexData } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import DexPicker from '../Components/DexPicker';
import PokemonGrid from '../Components/PokemonGrid';
import type { GridEntry } from '../Components/PokemonCard';
import { GridIcon, ListIcon, PokeballOutline } from '../Components/Icons';
import { Chip, Page, Panel, SearchInput, SelectBox } from '../Components/ui';
import { rankMatch } from '../Utils/search';
import { TYPES } from '../Utils/typeChart';
import { typeColours } from '../Utils/typeColours';
import { getDisplayName, getPokedexLabel } from '../Utils/text';
import { cn } from '../Utils/cn';
import type { Type } from '../types/pokeapi';

type Sort = 'number' | 'name';

export default function DexPage() {
  const { pokedex = 'national' } = useParams();
  const [params, setParams] = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const dex = usePokedexData(pokedex);
  const query = params.get('q') ?? '';
  const selectedTypes = (params.get('types') ?? '').split(',').filter(Boolean);
  const sort = (params.get('sort') ?? 'number') as Sort;
  const view = params.get('view') === 'compact' ? 'compact' : 'cards';
  const deferredQuery = React.useDeferredValue(query);

  const regionName = dex.region?.name;
  const label = regionName
    ? getDisplayName(getPokedexLabel(pokedex, regionName).toLowerCase(), ' ')
    : pokedex === 'national'
      ? 'National'
      : getDisplayName(pokedex);
  const title = `${label} Pokédex`;
  useDocumentTitle(
    regionName ? `${getDisplayName(regionName)} ${title}` : title
  );

  function setParam(key: string, value: string | null) {
    startTransition(() => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (value) next.set(key, value);
          else next.delete(key);
          return next;
        },
        { replace: true }
      );
    });
  }

  function toggleType(type: string) {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type].slice(-2); // a Pokémon has at most two types
    setParam('types', next.join(',') || null);
  }

  // Which Pokémon have the selected types, by id
  const typeQueries = useSuspenseQueries({
    queries: selectedTypes.map((type) => apiQuery<Type>(`type/${type}`)),
  });
  const typeKey = typeQueries.map((q) => q.dataUpdatedAt).join(',');
  const typeMembers = React.useMemo(
    () =>
      typeQueries.map(
        (q) => new Set(q.data.pokemon.map((p) => idFromUrl(p.pokemon.url)))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [typeKey]
  );

  const all = React.useMemo<GridEntry[]>(
    () =>
      dex.pokemon_entries.map((entry) => ({
        species: entry.pokemon_species,
        number: entry.entry_number,
      })),
    [dex]
  );

  const entries = React.useMemo(() => {
    let list = all;
    const needle = deferredQuery.trim();
    if (needle) {
      list = list.filter(({ species, number }) =>
        /^\d+$/.test(needle)
          ? String(number).startsWith(needle)
          : rankMatch(needle, species.name) !== Infinity
      );
    }
    if (typeMembers.length) {
      list = list.filter(({ species }) =>
        typeMembers.every((members) => members.has(idFromUrl(species.url)))
      );
    }
    if (sort === 'name') {
      list = [...list].sort((a, b) =>
        a.species.name.localeCompare(b.species.name)
      );
    }
    return list;
  }, [all, deferredQuery, typeMembers, sort]);

  const filtersActive = Boolean(query || selectedTypes.length);

  return (
    <Page wide>
      <section className="relative mb-6 overflow-hidden rounded-[1.125rem] border-[3px] border-pk-navy-deep ds-gloss-yellow px-5 py-6 text-pk-navy shadow-[inset_0_0_0_2px_rgb(255_255_255/0.6),0_3px_0_rgb(6_26_64/0.28)] sm:px-8 sm:py-8">
        <PokeballOutline
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -bottom-14 size-56 text-pk-navy/10 sm:size-72"
        />
        <p className="t-label text-pk-navy/70">
          {regionName ? `${getDisplayName(regionName)} region` : 'All regions'}
        </p>
        <h1 className="mt-1 t-h1 ds-text">{title}</h1>
        <p className="mt-1 t-body text-pk-navy/80">{all.length} Pokémon</p>
        <div className="relative mt-5">
          <DexPicker pokedex={pokedex} />
        </div>
      </section>

      <Panel className="mb-5" bodyClassName="space-y-3 sm:space-y-4">
        <div className="flex flex-wrap gap-3">
          <SearchInput
            label="Filter this Pokédex"
            placeholder="Filter by name or number…"
            value={query}
            onChange={(value) => setParam('q', value || null)}
            className="min-w-52 flex-1"
          />
          <SelectBox
            label="Sort by"
            value={sort}
            onChange={(value) =>
              setParam('sort', value === 'number' ? null : value)
            }
            className="w-40"
          >
            <option value="number">Number</option>
            <option value="name">Name A–Z</option>
          </SelectBox>
          <div className="flex overflow-hidden rounded-xl border-2 border-pk-line bg-white">
            {(
              [
                ['cards', 'Card view', GridIcon],
                ['compact', 'Compact view', ListIcon],
              ] as const
            ).map(([id, viewLabel, ViewIcon]) => (
              <button
                key={id}
                type="button"
                aria-label={viewLabel}
                aria-pressed={view === id}
                onClick={() => setParam('view', id === 'cards' ? null : id)}
                className={cn(
                  'flex w-12 items-center justify-center transition',
                  view === id
                    ? 'bg-pk-navy text-white'
                    : 'text-pk-ink hover:bg-pk-cream'
                )}
              >
                <ViewIcon className="size-5" />
              </button>
            ))}
          </div>
        </div>

        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
          <span className="shrink-0 t-label text-pk-muted">Type</span>
          {TYPES.map((type) => (
            <Chip
              key={type}
              active={selectedTypes.includes(type)}
              colour={typeColours[type]}
              onClick={() => toggleType(type)}
            >
              <span
                className="mr-2 inline-block size-2.5 rounded-full"
                style={{ backgroundColor: typeColours[type] }}
              />
              {getDisplayName(type)}
            </Chip>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="t-small text-pk-muted">
            {filtersActive
              ? `${entries.length} of ${all.length} shown`
              : `${all.length} Pokémon`}
          </p>
          {filtersActive && (
            <button
              type="button"
              onClick={() =>
                startTransition(() => setParams({}, { replace: true }))
              }
              className="t-small font-bold text-pk-red underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>
      </Panel>

      <div className={cn('transition-opacity', isPending && 'opacity-60')}>
        <PokemonGrid
          entries={entries}
          view={view}
          resetKey={`${pokedex}|${deferredQuery}|${selectedTypes}|${sort}|${view}`}
          emptyTitle="No Pokémon match these filters"
          emptyHint="Try clearing a filter or searching for something else."
        />
      </div>
    </Page>
  );
}
