import { Link } from 'react-router';
import { idFromUrl } from '../api/pokeapi';
import { pokemonSpriteUrl } from '../api/sprites';
import { usePokemonHref } from '../Utils/dex';
import { formatDexNumber, getDisplayName } from '../Utils/text';
import type { GridEntry } from './PokemonCard';

// A compact entry that needs no data requests: the sprite URL comes from the id
export default function PokemonTile({ species, number }: GridEntry) {
  const href = usePokemonHref();

  return (
    <Link
      to={href(species.name)}
      className="group flex flex-col items-center rounded-xl border border-pk-line bg-pk-paper px-2 pt-2 pb-3 text-center shadow-card transition hover:shadow-lift motion-safe:hover:-translate-y-0.5"
    >
      <img
        src={pokemonSpriteUrl(idFromUrl(species.url))}
        alt=""
        className="size-24 [image-rendering:pixelated]"
        loading="lazy"
        decoding="async"
      />
      <span className="t-label text-pk-muted">{formatDexNumber(number)}</span>
      <span className="mt-0.5 w-full truncate t-small font-bold">
        {getDisplayName(species.name)}
      </span>
    </Link>
  );
}
