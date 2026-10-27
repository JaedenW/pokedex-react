import React from 'react';
import { Link } from 'react-router';
import { idFromUrl } from '../api/pokeapi';
import { pokemonSpriteUrl } from '../api/sprites';
import { pokemonHref } from '../Utils/dex';
import { getDisplayName } from '../Utils/text';
import { EmptyState, buttonClass } from './ui';
import type { NamedAPIResource } from '../types/pokeapi';

export interface PokemonLink {
  pokemon: NamedAPIResource;
  badge?: string;
}

const BATCH = 48;

/** Sprites linking to Pokémon pages: used for "learned by", "has ability", etc. */
export default function PokemonLinkGrid({
  items,
  emptyTitle = 'No Pokémon',
}: {
  items: PokemonLink[];
  emptyTitle?: string;
}) {
  const [count, setCount] = React.useState(BATCH);

  if (!items.length) return <EmptyState title={emptyTitle} />;

  return (
    <div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2.5">
        {items.slice(0, count).map(({ pokemon, badge }) => (
          <li key={pokemon.name}>
            <Link
              to={pokemonHref(pokemon.name)}
              className="flex h-full flex-col items-center rounded-xl border border-pk-line bg-white px-1 pt-1.5 pb-2 text-center transition hover:border-pk-navy hover:shadow-card"
            >
              <img
                src={pokemonSpriteUrl(idFromUrl(pokemon.url))}
                alt=""
                loading="lazy"
                decoding="async"
                className="size-20 [image-rendering:pixelated]"
              />
              <span className="w-full t-small leading-tight font-bold break-words">
                {getDisplayName(pokemon.name)}
              </span>
              {badge && (
                <span className="mt-1 rounded bg-pk-cream px-1.5 py-0.5 t-label text-pk-muted">
                  {badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {count < items.length && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setCount((c) => c + BATCH)}
            className={buttonClass('primary', 'md')}
          >
            Show more ({items.length - count} left)
          </button>
        </div>
      )}
    </div>
  );
}
