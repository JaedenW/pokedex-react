import React from 'react';
import { Link } from 'react-router';
import { useAbility } from '../../api/pokeapi';
import { Loading, Panel, SelectBox } from '../ui';
import ItemImage from '../ItemImage';
import {
  englishFlavorText,
  firstEnglish,
  formatGeneration,
  getDisplayName,
  versionLabel,
} from '../../Utils/text';
import { catchChance, genderRatio, hatchSteps } from '../../Utils/stats';
import { useGame } from '../../Hooks/useGame';
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
        {getDisplayName(species.growth_rate.name)}
      </Fact>
      <Fact label="Egg groups">
        {species.egg_groups
          .map((group) => getDisplayName(group.name))
          .join(', ') || '—'}
      </Fact>
      <Fact label="Hatch steps">
        {species.hatch_counter !== null
          ? hatchSteps(species.hatch_counter).toLocaleString()
          : '—'}
      </Fact>
      <Fact label="Habitat">
        {species.habitat ? getDisplayName(species.habitat.name) : '—'}
      </Fact>
      <Fact label="Colour">
        {species.color ? getDisplayName(species.color.name) : '—'}
      </Fact>
      <Fact label="Introduced">
        {formatGeneration(species.generation.name)}
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

export default function OverviewTab({ species, pokemon }: TabProps) {
  const heldItems = pokemon.held_items;
  const { game, generation, versions } = useGame();
  const types = generation
    ? memberTypesInGeneration(pokemon, generation)
    : pokemon.types.map((t) => t.type.name);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <PokedexEntry key={game} species={species} versions={versions} />
        <Panel title="Base stats">
          <StatBars pokemon={pokemon} />
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
          <ul className="space-y-2.5">
            {pokemon.abilities.map(({ ability, is_hidden }) => (
              <React.Suspense
                key={ability.name}
                fallback={
                  <li className="h-20 animate-pulse rounded-xl bg-pk-line/50" />
                }
              >
                <AbilityRow name={ability.name} hidden={is_hidden} />
              </React.Suspense>
            ))}
          </ul>
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
      </div>
    </div>
  );
}
