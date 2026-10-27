import type { ReactNode } from 'react';
import { idFromUrl } from '../../api/pokeapi';
import { officialArtworkUrl } from '../../api/sprites';
import { Panel } from '../ui';
import {
  formLabel,
  formatGeneration,
  getDisplayName,
  versionGroupLabel,
} from '../../Utils/text';
import { cn } from '../../Utils/cn';
import type { Pokemon, PokemonSpecies, SpriteTree } from '../../types/pokeapi';

interface GalleryProps {
  species: PokemonSpecies;
  pokemon: Pokemon;
  formName: string;
  onSelectForm: (name: string) => void;
}

function SpriteTile({
  src,
  label,
  large = false,
  pixel = false,
}: {
  src?: string | null;
  label: string;
  large?: boolean;
  pixel?: boolean;
}) {
  if (!src) return null;
  return (
    <figure className="flex flex-col items-center rounded-xl border border-pk-line bg-white p-3 text-center">
      <img
        src={src}
        alt={label}
        loading="lazy"
        decoding="async"
        className={cn(
          large ? 'size-40' : 'size-24',
          'object-contain',
          pixel && '[image-rendering:pixelated]'
        )}
      />
      <figcaption className="mt-2 t-label text-pk-muted">{label}</figcaption>
    </figure>
  );
}

const SPRITE_KEYS: [string, string][] = [
  ['front_default', 'Front'],
  ['back_default', 'Back'],
  ['front_shiny', 'Shiny front'],
  ['back_shiny', 'Shiny back'],
  ['front_female', 'Female front'],
  ['back_female', 'Female back'],
  ['front_shiny_female', 'Shiny female front'],
  ['back_shiny_female', 'Shiny female back'],
];

function SpriteSet({
  sprites,
  pixel,
}: {
  sprites: Record<string, unknown> | undefined;
  pixel?: boolean;
}): ReactNode {
  return SPRITE_KEYS.map(([key, label]) => (
    <SpriteTile
      key={key}
      src={typeof sprites?.[key] === 'string' ? (sprites[key] as string) : null}
      label={label}
      pixel={pixel}
    />
  ));
}

const GRID = 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4';

function RetroSprites({ pokemon }: { pokemon: Pokemon }) {
  const generations = Object.entries(pokemon.sprites.versions ?? {})
    .map(([generation, games]) => ({
      generation,
      games: Object.entries(games).filter(
        ([, tree]) => typeof tree.front_default === 'string'
      ),
    }))
    .filter(({ games }) => games.length);

  if (!generations.length) return null;

  return (
    <Panel title="Sprites by game">
      <div className="space-y-6">
        {generations.map(({ generation, games }) => (
          <section key={generation}>
            <h3 className="mb-2.5 t-small font-bold text-pk-muted">
              {formatGeneration(generation)}
            </h3>
            <div className={GRID}>
              {games.map(([game, tree]) => (
                <figure
                  key={game}
                  className="rounded-xl border border-pk-line bg-white p-3 text-center"
                >
                  <div className="flex justify-center gap-1">
                    {(['front_default', 'front_shiny'] as const).map((key) => {
                      const src = (tree as SpriteTree)[key];
                      return typeof src === 'string' ? (
                        <img
                          key={key}
                          src={src}
                          alt={`${game} ${key === 'front_shiny' ? 'shiny ' : ''}sprite`}
                          loading="lazy"
                          className="size-20 object-contain [image-rendering:pixelated]"
                        />
                      ) : null;
                    })}
                  </div>
                  <figcaption className="mt-2 t-label text-pk-muted">
                    {versionGroupLabel(game)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Panel>
  );
}

export default function GalleryTab({
  species,
  pokemon,
  formName,
  onSelectForm,
}: GalleryProps) {
  const other = pokemon.sprites.other;
  const hasForms = species.varieties.length > 1;

  return (
    <div className="space-y-4">
      {hasForms && (
        <Panel title="Forms">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {species.varieties.map(({ pokemon: variety }) => {
              const selected = variety.name === formName;
              return (
                <button
                  key={variety.name}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelectForm(variety.name)}
                  className={cn(
                    'flex flex-col items-center rounded-xl border-2 bg-white p-3 text-center transition hover:shadow-lift',
                    selected ? 'border-pk-navy shadow-card' : 'border-pk-line'
                  )}
                >
                  <img
                    src={officialArtworkUrl(idFromUrl(variety.url))}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-32 object-contain"
                  />
                  <span className="mt-1 t-body font-bold">
                    {formLabel(variety.name, species.name)}
                  </span>
                </button>
              );
            })}
          </div>
        </Panel>
      )}

      <Panel title="Artwork">
        <div className={GRID}>
          <SpriteTile
            large
            label="Official"
            src={other?.['official-artwork']?.front_default}
          />
          <SpriteTile
            large
            label="Official shiny"
            src={other?.['official-artwork']?.front_shiny}
          />
          <SpriteTile large label="HOME" src={other?.home?.front_default} />
          <SpriteTile large label="HOME shiny" src={other?.home?.front_shiny} />
          <SpriteTile
            large
            label="HOME female"
            src={other?.home?.front_female}
          />
          <SpriteTile
            large
            label="HOME shiny female"
            src={other?.home?.front_shiny_female}
          />
          <SpriteTile
            large
            label="Dream World"
            src={other?.dream_world?.front_default}
          />
        </div>
        {species.has_gender_differences && (
          <p className="mt-3 t-small text-pk-muted">
            {getDisplayName(species.name)} looks different between genders.
          </p>
        )}
      </Panel>

      <Panel title="Game sprites">
        <div className={GRID}>
          <SpriteSet
            sprites={pokemon.sprites as unknown as Record<string, unknown>}
            pixel
          />
        </div>
      </Panel>

      {other?.showdown && Object.values(other.showdown).some(Boolean) && (
        <Panel title="Animated">
          <div className={GRID}>
            <SpriteSet
              sprites={other.showdown as unknown as Record<string, unknown>}
              pixel
            />
          </div>
        </Panel>
      )}

      <RetroSprites pokemon={pokemon} />
    </div>
  );
}
