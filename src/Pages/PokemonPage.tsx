import React from 'react';
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { apiUrl, idFromUrl, usePokemon } from '../api/pokeapi';
import { pokemonSpriteUrl } from '../api/sprites';
import { usePrevNext, type Neighbour } from '../Hooks/usePrevNext';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import { BackButton } from '../Components/PageHeader';
import { ChevronLeftIcon, ChevronRightIcon } from '../Components/Icons';
import { Loading, Page, Tabs } from '../Components/ui';
import PokemonHero from '../Components/pokemon/PokemonHero';
import OverviewTab from '../Components/pokemon/OverviewTab';
import GalleryTab from '../Components/pokemon/GalleryTab';
import EvolutionTab from '../Components/pokemon/EvolutionTab';
import MovesTab from '../Components/pokemon/MovesTab';
import LocationsTab from '../Components/pokemon/LocationsTab';
import { fetchJson, HttpError } from '../Utils/fetchJson';
import { DEFAULT_GAME } from '../Utils/games';
import { pokemonHref, useDexName } from '../Utils/dex';
import { getDefaultVariety } from '../Utils/species';
import { formatDexNumber, getDisplayName } from '../Utils/text';
import type { Pokemon, PokemonSpecies } from '../types/pokeapi';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'evolution', label: 'Evolution' },
  { id: 'moves', label: 'Moves' },
  { id: 'locations', label: 'Locations' },
] as const;
type TabId = (typeof TABS)[number]['id'];

type Resolved =
  { species: PokemonSpecies } | { redirect: string; form: string };

// Links may name a species ("charizard"), a form ("charizard-mega-x") or an id
async function resolveSpecies(name: string): Promise<Resolved> {
  try {
    return {
      species: await fetchJson<PokemonSpecies>(
        apiUrl(`pokemon-species/${name}`)
      ),
    };
  } catch (error) {
    if (!(error instanceof HttpError && error.status === 404)) throw error;
    const pokemon = await fetchJson<Pokemon>(apiUrl(`pokemon/${name}`));
    return { redirect: pokemon.species.name, form: pokemon.name };
  }
}

function NeighbourLink({
  neighbour,
  direction,
  dex,
}: {
  neighbour: Neighbour;
  direction: 'prev' | 'next';
  dex: string;
}) {
  return (
    <Link
      to={pokemonHref(neighbour.species.name, dex)}
      aria-label={`${direction === 'prev' ? 'Previous' : 'Next'}: ${getDisplayName(neighbour.species.name)}`}
      className="flex h-12 max-w-44 min-w-0 items-center gap-1 rounded-full border-2 border-pk-line bg-white py-0.5 pr-3 pl-2 shadow-card transition hover:border-pk-navy sm:max-w-56"
    >
      {direction === 'prev' && <ChevronLeftIcon className="size-5 shrink-0" />}
      <img
        src={pokemonSpriteUrl(idFromUrl(neighbour.species.url))}
        alt=""
        className="size-10 shrink-0 [image-rendering:pixelated]"
      />
      <span className="min-w-0 text-left">
        <span className="block t-label leading-none text-pk-muted">
          {formatDexNumber(neighbour.number)}
        </span>
        <span className="block truncate t-small leading-tight font-bold">
          {getDisplayName(neighbour.species.name)}
        </span>
      </span>
      {direction === 'next' && <ChevronRightIcon className="size-5 shrink-0" />}
    </Link>
  );
}

function PokemonView({ species }: { species: PokemonSpecies }) {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const dex = useDexName();
  const defaultForm = getDefaultVariety(species).pokemon.name;
  const formName = params.get('form') ?? defaultForm;
  const tab = (TABS.find((t) => t.id === params.get('tab'))?.id ??
    'overview') as TabId;
  const game = params.get('game');
  const pokemon = usePokemon(formName);
  const { prev, next, number, pokedex } = usePrevNext(species.name);

  useDocumentTitle(getDisplayName(species.name));

  function setParam(key: string, value: string | null) {
    setParams(
      (current) => {
        const updated = new URLSearchParams(current);
        if (value) updated.set(key, value);
        else updated.delete(key);
        return updated;
      },
      { replace: true }
    );
  }

  // ← / → move through the Pokédex
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (
        /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) ||
        target.isContentEditable
      ) {
        return;
      }
      const neighbour =
        event.key === 'ArrowLeft'
          ? prev
          : event.key === 'ArrowRight'
            ? next
            : undefined;
      if (neighbour) navigate(pokemonHref(neighbour.species.name, dex));
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [prev, next, navigate, dex]);

  // swipe the artwork sideways for the previous or next Pokémon
  const swipeStart = React.useRef<{ x: number; y: number } | null>(null);
  function onTouchStart(event: React.TouchEvent) {
    const touch = event.touches[0];
    swipeStart.current = { x: touch.clientX, y: touch.clientY };
  }
  function onTouchEnd(event: React.TouchEvent) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 90 || Math.abs(dy) > 60) return;
    const neighbour = dx > 0 ? prev : next;
    if (neighbour) navigate(pokemonHref(neighbour.species.name, dex));
  }

  const dexLabel =
    pokedex === 'national'
      ? 'National Pokédex'
      : `${getDisplayName(pokedex)} Pokédex`;
  const teamHref = `/team?game=${game ?? DEFAULT_GAME}&team=${species.name}`;

  return (
    <Page>
      <div className="mb-4 flex items-center gap-2">
        <BackButton fallback={`/dex/${pokedex}`} />
        <div className="ml-auto flex min-w-0 gap-2">
          {prev && (
            <NeighbourLink neighbour={prev} direction="prev" dex={dex} />
          )}
          {next && (
            <NeighbourLink neighbour={next} direction="next" dex={dex} />
          )}
        </div>
      </div>

      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <PokemonHero
          species={species}
          pokemon={pokemon}
          dexNumber={number}
          dexLabel={dexLabel}
          teamHref={teamHref}
        />
      </div>

      <div className="sticky top-0 z-30 -mx-4 mt-6 bg-pk-cream/95 px-4 pt-1 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <Tabs
          tabs={TABS.map((t) => ({ id: t.id, label: t.label }))}
          value={tab}
          onChange={(id) => setParam('tab', id === 'overview' ? null : id)}
        />
      </div>

      <div className="pt-5">
        <React.Suspense fallback={<Loading />}>
          {tab === 'overview' && (
            <OverviewTab species={species} pokemon={pokemon} />
          )}
          {tab === 'gallery' && (
            <GalleryTab
              species={species}
              pokemon={pokemon}
              formName={formName}
              onSelectForm={(name) =>
                setParam('form', name === defaultForm ? null : name)
              }
            />
          )}
          {tab === 'evolution' && <EvolutionTab species={species} />}
          {tab === 'moves' && (
            <MovesTab
              pokemon={pokemon}
              game={game}
              onGameChange={(name) => setParam('game', name)}
            />
          )}
          {tab === 'locations' && <LocationsTab pokemon={pokemon} />}
        </React.Suspense>
      </div>
    </Page>
  );
}

export default function PokemonPage() {
  const { name = '' } = useParams();
  const dex = useDexName();
  const { data } = useSuspenseQuery({
    queryKey: ['resolve-species', name],
    queryFn: () => resolveSpecies(name),
  });

  if ('redirect' in data) {
    const keep = dex === 'national' ? '' : `&dex=${dex}`;
    return (
      <Navigate
        to={`/pokemon/${data.redirect}?form=${data.form}${keep}`}
        replace
      />
    );
  }
  if (data.species.name !== name) {
    return <Navigate to={pokemonHref(data.species.name, dex)} replace />;
  }
  return <PokemonView key={data.species.name} species={data.species} />;
}
