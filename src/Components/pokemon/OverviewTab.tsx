import React from 'react';
import { Link } from 'react-router';
import { useAbility } from '../../api/pokeapi';
import { Loading, Panel, SelectBox } from '../ui';
import ItemImage from '../ItemImage';
import {
  englishFlavorText,
  firstEnglish,
  formatDexNumber,
  formatGeneration,
  getDisplayName,
  versionLabel,
} from '../../Utils/text';
import { catchChance, genderRatio, hatchSteps } from '../../Utils/stats';
import { useGame } from '../../Hooks/useGame';
import { abilitiesInGeneration, statsInGeneration } from '../../Utils/history';
import { memberTypesInGeneration } from '../../Utils/teamPlan';
import StatBars from './StatBars';
import TypeDefenses from './TypeDefenses';
import type { Pokemon, PokemonSpecies } from '../../types/pokeapi';

interface TabProps {
  species: PokemonSpecies;
  pokemon: Pokemon;
}

function PokedexEntry({
  species,
  versions,
}: {
  species: PokemonSpecies;
  /** The selected game's versions; its entry is shown first */
  versions: string[];
}) {
  const entries = React.useMemo(
    () => englishFlavorText(species.flavor_text_entries),
    [species]
  );
  const [version, setVersion] = React.useState(
    entries.findLast((entry) => versions.includes(entry.version?.name ?? ''))
      ?.version?.name ??
      entries.at(-1)?.version?.name ??
      ''
  );
  const selected = entries.find((entry) => entry.version?.name === version);

  if (!entries.length) return null;

  return (
    <Panel
      title="Pokédex entry"
      actions={
        <SelectBox
          label="Game"
          value={version}
          onChange={setVersion}
          className="w-52"
        >
          {entries.map((entry) => (
            <option key={entry.version?.name} value={entry.version?.name}>
              {versionLabel(entry.version?.name ?? '')}
            </option>
          ))}
        </SelectBox>
      }
    >
      <p className="max-w-prose t-body">{selected?.flavor_text}</p>
    </Panel>
  );
}

function GuideLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={`/guide/${to}`}
      className="text-pk-navy underline-offset-2 hover:underline"
    >
      {children}
    </Link>
  );
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-pk-line bg-white p-3">
      <dt className="t-label text-pk-muted">{label}</dt>
      <dd className="mt-1.5 t-body font-bold">{children}</dd>
    </div>
  );
}

function Facts({ species, pokemon }: TabProps) {
  const gender = genderRatio(species.gender_rate);
  const heightM = pokemon.height / 10;
  const totalInches = Math.round(heightM * 39.3701);
  const weightKg = pokemon.weight / 10;
  const note = 'text-pk-muted font-normal t-small';

  return (
    <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      <Fact label="Height">
        {heightM} m{' '}
        <span className={note}>
          ({Math.floor(totalInches / 12)}′
          {String(totalInches % 12).padStart(2, '0')}″)
        </span>
      </Fact>
      <Fact label="Weight">
        {weightKg} kg{' '}
        <span className={note}>({(weightKg * 2.20462).toFixed(1)} lb)</span>
      </Fact>
      <Fact label="Gender">
        {gender ? (
          <span>
            <span className="text-[#4a78e0]">♂ {gender.male}%</span>{' '}
            <span className="text-[#e0456f]">♀ {gender.female}%</span>
          </span>
        ) : (
          'Genderless'
        )}
      </Fact>
      <Fact label="Catch rate">
        {species.capture_rate}{' '}
        <span className={note}>
          (~{catchChance(species.capture_rate).toFixed(1)}%)
        </span>
      </Fact>
      <Fact label="Base friendship">{species.base_happiness ?? '—'}</Fact>
      <Fact label="Base EXP">{pokemon.base_experience ?? '—'}</Fact>
      <Fact label="Growth rate">
        <GuideLink to={`growth-rate/${species.growth_rate.name}`}>
          {getDisplayName(species.growth_rate.name)}
        </GuideLink>
      </Fact>
      <Fact label="Egg groups">
        {species.egg_groups.length
          ? species.egg_groups.map((group, index) => (
              <span key={group.name}>
                {index > 0 && ', '}
                <GuideLink to={`egg-group/${group.name}`}>
                  {getDisplayName(group.name)}
                </GuideLink>
              </span>
            ))
          : '—'}
      </Fact>
      <Fact label="Hatch steps">
        {species.hatch_counter !== null
          ? hatchSteps(species.hatch_counter).toLocaleString()
          : '—'}
      </Fact>
      <Fact label="Habitat">
        {species.habitat ? (
          <GuideLink to={`pokemon-habitat/${species.habitat.name}`}>
            {getDisplayName(species.habitat.name)}
          </GuideLink>
        ) : (
          '—'
        )}
      </Fact>
      <Fact label="Colour">
        {species.color ? (
          <GuideLink to={`pokemon-color/${species.color.name}`}>
            {getDisplayName(species.color.name)}
          </GuideLink>
        ) : (
          '—'
        )}
      </Fact>
      <Fact label="Shape">
        {species.shape ? (
          <GuideLink to={`pokemon-shape/${species.shape.name}`}>
            {getDisplayName(species.shape.name)}
          </GuideLink>
        ) : (
          '—'
        )}
      </Fact>
      <Fact label="Introduced">
        <Link
          to={`/generation/${species.generation.name}`}
          className="text-pk-navy underline-offset-2 hover:underline"
        >
          {formatGeneration(species.generation.name)}
        </Link>
      </Fact>
    </dl>
  );
}

function AbilityRow({ name, hidden }: { name: string; hidden: boolean }) {
  const ability = useAbility(name);
  const effect = firstEnglish(ability.effect_entries);

  return (
    <li className="rounded-xl border border-pk-line bg-white p-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to={`/ability/${name}`}
          className="t-body font-bold text-pk-navy underline-offset-2 hover:underline"
        >
          {getDisplayName(name)}
        </Link>
        {hidden && (
          <span className="rounded-md bg-pk-cream px-2 py-1 t-label text-pk-muted">
            Hidden
          </span>
        )}
      </div>
      <p className="mt-1 t-small text-pk-muted">{effect?.short_effect}</p>
    </li>
  );
}

function DexNumbers({ species }: { species: PokemonSpecies }) {
  return (
    <Panel title="Pokédex numbers">
      <ul className="flex flex-wrap gap-2">
        {species.pokedex_numbers.map(({ entry_number, pokedex }) => (
          <li key={pokedex.name}>
            <Link
              to={`/dex/${pokedex.name}`}
              className="inline-flex items-center gap-2 rounded-lg border border-pk-line bg-white px-3 py-1 t-small transition hover:border-pk-navy"
            >
              <span className="font-bold">{getDisplayName(pokedex.name)}</span>
              <span className="text-pk-muted">
                {formatDexNumber(entry_number)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function PalPark({ species }: { species: PokemonSpecies }) {
  return (
    <Panel title="Pal Park">
      <ul className="space-y-1 t-body">
        {species.pal_park_encounters.map(({ area, base_score, rate }) => (
          <li key={area.name} className="flex justify-between gap-3">
            <Link
              to={`/guide/pal-park-area/${area.name}`}
              className="font-bold text-pk-navy underline-offset-2 hover:underline"
            >
              {getDisplayName(area.name)}
            </Link>
            <span className="text-pk-muted">
              {base_score} pts · {rate}%
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function ForeignNames({ species }: { species: PokemonSpecies }) {
  return (
    <Panel title="Names around the world">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
        {species.names.map(({ name, language }) => (
          <div key={language.name} className="min-w-0">
            <dt className="t-label text-pk-muted">
              <Link
                to={`/guide/language/${language.name}`}
                className="underline-offset-2 hover:underline"
              >
                {language.name}
              </Link>
            </dt>
            <dd className="font-sans text-base break-words">{name}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

export default function OverviewTab({ species, pokemon }: TabProps) {
  const { game, generation, versions } = useGame();
  const stats = generation
    ? statsInGeneration(pokemon, generation)
    : pokemon.stats;
  const abilities = generation
    ? abilitiesInGeneration(pokemon, generation)
    : pokemon.abilities;
  // held items are recorded per version, so only show the selected game's
  const heldItems = pokemon.held_items.flatMap(({ item, version_details }) => {
    const details = versions.length
      ? version_details.filter((v) => versions.includes(v.version.name))
      : version_details;
    return details.length ? [{ item, version_details: details }] : [];
  });
  const types = generation
    ? memberTypesInGeneration(pokemon, generation)
    : pokemon.types.map((t) => t.type.name);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <PokedexEntry key={game} species={species} versions={versions} />
        <Panel title="Base stats">
          <StatBars stats={stats} />
        </Panel>
        <Panel title="Type matchups">
          <React.Suspense fallback={<Loading className="h-24" />}>
            <TypeDefenses types={types} generation={generation} />
          </React.Suspense>
        </Panel>
      </div>
      <div className="space-y-4">
        <Panel title="Details">
          <Facts species={species} pokemon={pokemon} />
        </Panel>
        <Panel title="Abilities">
          {abilities.length ? (
            <ul className="space-y-2.5">
              {abilities.map(({ ability, is_hidden }) =>
                ability ? (
                  <React.Suspense
                    key={ability.name}
                    fallback={
                      <li className="h-20 animate-pulse rounded-xl bg-pk-line/50" />
                    }
                  >
                    <AbilityRow name={ability.name} hidden={is_hidden} />
                  </React.Suspense>
                ) : null
              )}
            </ul>
          ) : (
            <p className="t-body text-pk-muted">
              Abilities arrived in Generation III.
            </p>
          )}
        </Panel>
        {heldItems.length > 0 && (
          <Panel title="Held items">
            <ul className="flex flex-wrap gap-2">
              {heldItems.map(({ item, version_details }) => (
                <li key={item.name}>
                  <Link
                    to={`/item/${item.name}`}
                    className="flex items-center gap-2 rounded-full border border-pk-line bg-white py-1 pr-4 pl-2 transition hover:border-pk-navy"
                  >
                    <ItemImage name={item.name} className="size-9" />
                    <span className="t-small font-bold">
                      {getDisplayName(item.name)}
                    </span>
                    <span className="t-label text-pk-muted">
                      {Math.max(...version_details.map((v) => v.rarity))}%
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        )}
        {species.pal_park_encounters.length > 0 && (
          <PalPark species={species} />
        )}
        <DexNumbers species={species} />
        <ForeignNames species={species} />
      </div>
    </div>
  );
}
