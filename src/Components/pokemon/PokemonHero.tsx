import React from 'react';
import { Link } from 'react-router';
import {
  firstEnglish,
  formLabel,
  formatDexNumber,
  getDisplayName,
} from '../../Utils/text';
import { typeColours } from '../../Utils/typeColours';
import { officialArtworkUrl } from '../../api/sprites';
import { cn } from '../../Utils/cn';
import TypeBadge from '../TypeBadge';
import { SoundIcon, SparkleIcon, TeamIcon } from '../Icons';
import { buttonClass } from '../ui';
import type { Pokemon, PokemonSpecies } from '../../types/pokeapi';

const canPlayOgg =
  typeof document !== 'undefined' &&
  document.createElement('audio').canPlayType('audio/ogg') !== '';

function CryButton({ url }: { url: string }) {
  const [playing, setPlaying] = React.useState(false);
  const audio = React.useRef<HTMLAudioElement | null>(null);

  function play() {
    audio.current?.pause();
    const next = new Audio(url);
    next.volume = 0.5;
    next.onended = () => setPlaying(false);
    next.onerror = () => setPlaying(false);
    audio.current = next;
    setPlaying(true);
    next.play().catch(() => setPlaying(false));
  }

  return (
    <button
      type="button"
      onClick={play}
      className={buttonClass(playing ? 'accent' : 'secondary', 'md')}
    >
      <SoundIcon className="size-5" />
      Cry
    </button>
  );
}

interface PokemonHeroProps {
  species: PokemonSpecies;
  pokemon: Pokemon;
  dexNumber?: number;
  dexLabel: string;
  /** Where "Plan a team" goes, with this Pokémon already on it */
  teamHref: string;
}

export default function PokemonHero({
  species,
  pokemon,
  dexNumber,
  dexLabel,
  teamHref,
}: PokemonHeroProps) {
  const [shiny, setShiny] = React.useState(false);
  const primary = typeColours[pokemon.types[0]?.type.name] ?? '#a8a77a';
  const secondary = typeColours[pokemon.types[1]?.type.name] ?? primary;
  const artwork = pokemon.sprites.other?.['official-artwork'];
  const art =
    (shiny ? artwork?.front_shiny : artwork?.front_default) ??
    officialArtworkUrl(pokemon.id, shiny);
  const displayName = getDisplayName(species.name);
  const form = formLabel(pokemon.name, species.name);
  const genus = firstEnglish(species.genera)?.genus;

  return (
    <article className="grid gap-4 lg:grid-cols-[minmax(0,27rem)_minmax(0,1fr)]">
      <div
        className="relative overflow-hidden ds-frame"
        style={{
          background: `radial-gradient(circle at 50% 58%, #ffffffb3 0%, transparent 62%), linear-gradient(150deg, ${primary}88, ${secondary}44)`,
        }}
      >
        <span className="pointer-events-none absolute top-3 left-5 t-display text-pk-ink/12">
          {formatDexNumber(dexNumber ?? species.id)}
        </span>
        <button
          type="button"
          aria-pressed={shiny}
          onClick={() => setShiny((value) => !value)}
          className={cn(
            buttonClass(shiny ? 'accent' : 'secondary', 'sm'),
            'absolute top-4 right-4'
          )}
        >
          <SparkleIcon className="size-5" />
          Shiny
        </button>
        <img
          key={art}
          src={art}
          alt={`${displayName}${form === 'Default' ? '' : ` (${form})`}`}
          className="relative mx-auto my-8 size-64 object-contain drop-shadow-xl sm:size-80"
          decoding="async"
        />
      </div>

      <div className="flex flex-col justify-center ds-frame p-5 sm:p-8">
        <p className="t-label text-pk-muted">
          {dexNumber !== undefined && (
            <>
              {dexLabel} {formatDexNumber(dexNumber)} ·{' '}
            </>
          )}
          National {formatDexNumber(species.id)}
        </p>
        <h1 className="mt-2 t-display break-words text-pk-ink">
          {displayName}
        </h1>
        <p className="mt-2 t-body text-pk-muted">
          {genus}
          {form !== 'Default' && ` · ${form}`}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {pokemon.types.map(({ type }) => (
            <TypeBadge key={type.name} name={type.name} size="lg" icon />
          ))}
          {species.is_legendary && (
            <span className="inline-flex h-11 items-center rounded-lg bg-[#ffd500] px-4 t-label font-bold text-pk-ink">
              Legendary
            </span>
          )}
          {species.is_mythical && (
            <span className="inline-flex h-11 items-center rounded-lg bg-[#855AC9] px-4 t-label font-bold text-white">
              Mythical
            </span>
          )}
          {species.is_baby && (
            <span className="inline-flex h-11 items-center rounded-lg bg-pink-300 px-4 t-label font-bold text-pk-ink">
              Baby
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Link to={teamHref} className={buttonClass('primary', 'md')}>
            <TeamIcon className="size-5" />
            Plan a team
          </Link>
          {canPlayOgg && pokemon.cries.latest && (
            <CryButton url={pokemon.cries.latest} />
          )}
        </div>
      </div>
    </article>
  );
}
