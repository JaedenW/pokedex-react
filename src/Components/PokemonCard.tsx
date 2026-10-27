import { Link } from 'react-router';
import { pathFromUrl, useApi } from '../api/pokeapi';
import { getDefaultVariety } from '../Utils/species';
import { usePokemonHref } from '../Utils/dex';
import { formatDexNumber, getDisplayName } from '../Utils/text';
import { typeColours } from '../Utils/typeColours';
import TypeBadge from './TypeBadge';
import type {
  NamedAPIResource,
  Pokemon,
  PokemonSpecies,
} from '../types/pokeapi';

export interface GridEntry {
  species: NamedAPIResource;
  /** The number shown on the card, in the Pokédex being browsed */
  number: number;
}

/** A soft glow of the Pokémon's type behind its sprite. */
export const typeGlow = (type?: string) => {
  const colour = (type && typeColours[type]) || '#a8a77a';
  return `radial-gradient(circle at 50% 78%, ${colour}66 0%, ${colour}1f 55%, transparent 100%)`;
};

export default function PokemonCard({ species, number }: GridEntry) {
  const { name, url } = species;
  const href = usePokemonHref();
  const displayName = getDisplayName(name);
  const speciesData = useApi<PokemonSpecies>(pathFromUrl(url));
  const pokemon = useApi<Pokemon>(
    pathFromUrl(getDefaultVariety(speciesData).pokemon.url)
  );

  return (
    <Link
      to={href(name)}
      className="group block overflow-hidden ds-frame ds-frame-hover transition motion-safe:hover:-translate-y-1"
    >
      <div
        className="relative grid h-36 place-items-center"
        style={{ background: typeGlow(pokemon.types[0]?.type.name) }}
      >
        <span className="absolute top-1.5 left-1.5 rounded-full border-2 border-pk-navy-deep ds-gloss px-2.5 pt-0.5 pb-0 t-label text-white ds-text-dark">
          {formatDexNumber(number)}
        </span>
        <img
          className="size-28 object-contain transition motion-safe:group-hover:scale-110"
          src={pokemon.sprites.front_default ?? undefined}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="border-t-[3px] border-pk-navy-deep bg-linear-to-b from-white to-pk-silver px-3 pt-2.5 pb-3 text-center">
        <h2 className="truncate t-h3 text-pk-ink ds-text">{displayName}</h2>
        <div className="mt-2 flex h-7 justify-center gap-1.5">
          {pokemon.types.map(({ type, slot }) => (
            <TypeBadge key={slot} name={type.name} linked={false} size="sm" />
          ))}
        </div>
      </div>
    </Link>
  );
}
