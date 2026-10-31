import { Link, useParams } from 'react-router';
import { useSuspenseQueries } from '@tanstack/react-query';
import { apiQuery, pathFromUrl, useApi } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import DetailBanner from '../Components/DetailBanner';
import ItemLinkGrid from '../Components/ItemLinkGrid';
import LinkChips, { type ChipLink } from '../Components/LinkChips';
import MoveRowList from '../Components/MoveRowList';
import PokemonLinkGrid from '../Components/PokemonLinkGrid';
import { Page, Panel, StatTile } from '../Components/ui';
import NotFoundPage from './NotFoundPage';
import { guideResource } from '../Utils/guide';
import { STAT_LABELS } from '../Utils/stats';
import {
  englishName,
  firstEnglish,
  getDisplayName,
  versionGroupLabel,
} from '../Utils/text';
import type {
  Characteristic,
  GuideEntry,
  NamedAPIResource,
  Nature,
} from '../types/pokeapi';

const signed = (value: number) => (value > 0 ? `+${value}` : String(value));

const natureLinks = (natures: NamedAPIResource[]): ChipLink[] =>
  natures.map((nature) => ({
    to: `/guide/nature/${nature.name}`,
    label: getDisplayName(nature.name),
  }));

function NatureDetails({ name }: { name: string }) {
  const nature = useApi<Nature>(`nature/${name}`);
  const up = nature.increased_stat?.name;
  const down = nature.decreased_stat?.name;

  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatTile
          label="Raises"
          value={
            up ? (
              <Link to={`/guide/stat/${up}`}>{STAT_LABELS[up] ?? up}</Link>
            ) : (
              '—'
            )
          }
        />
        <StatTile
          label="Lowers"
          value={
            down ? (
              <Link to={`/guide/stat/${down}`}>
                {STAT_LABELS[down] ?? down}
              </Link>
            ) : (
              '—'
            )
          }
        />
        <StatTile
          label="Likes"
          value={
            nature.likes_flavor ? (
              <Link to={`/guide/berry-flavor/${nature.likes_flavor.name}`}>
                {getDisplayName(nature.likes_flavor.name)}
              </Link>
            ) : (
              '—'
            )
          }
        />
        <StatTile
          label="Dislikes"
          value={
            nature.hates_flavor ? (
              <Link to={`/guide/berry-flavor/${nature.hates_flavor.name}`}>
                {getDisplayName(nature.hates_flavor.name)}
              </Link>
            ) : (
              '—'
            )
          }
        />
      </dl>

      <div className="grid gap-4 lg:grid-cols-2">
        {nature.move_battle_style_preferences.length > 0 && (
          <Panel title="Battle Palace style">
            <table className="w-full t-body">
              <thead>
                <tr className="t-label text-pk-muted">
                  <th className="text-left font-normal">Style</th>
                  <th className="text-right font-normal">Above half HP</th>
                  <th className="text-right font-normal">Below half HP</th>
                </tr>
              </thead>
              <tbody>
                {nature.move_battle_style_preferences.map((style) => (
                  <tr key={style.move_battle_style.name}>
                    <td>
                      <Link
                        to={`/guide/move-battle-style/${style.move_battle_style.name}`}
                        className="font-bold text-pk-navy underline-offset-2 hover:underline"
                      >
                        {getDisplayName(style.move_battle_style.name)}
                      </Link>
                    </td>
                    <td className="text-right">{style.high_hp_preference}%</td>
                    <td className="text-right">{style.low_hp_preference}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        )}
        {nature.pokeathlon_stat_changes.length > 0 && (
          <Panel title="Pokéathlon">
            <ul className="space-y-1 t-body">
              {nature.pokeathlon_stat_changes.map((change) => (
                <li
                  key={change.pokeathlon_stat.name}
                  className="flex justify-between gap-3"
                >
                  <Link
                    to={`/guide/pokeathlon-stat/${change.pokeathlon_stat.name}`}
                    className="font-bold text-pk-navy underline-offset-2 hover:underline"
                  >
                    {getDisplayName(change.pokeathlon_stat.name)}
                  </Link>
                  <span>Up to {signed(change.max_change)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </div>
  );
}

const LEVEL_MARKS = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function ExperienceTable({ entry }: { entry: GuideEntry }) {
  const levels = entry.levels ?? [];
  const top = levels.at(-1)?.experience ?? 1;

  return (
    <Panel title="EXP to reach a level">
      <ul className="space-y-1.5">
        {levels
          .filter(({ level }) => LEVEL_MARKS.includes(level))
          .map(({ level, experience }) => (
            <li
              key={level}
              className="grid grid-cols-[4rem_1fr_6.5rem] items-center gap-2 t-body"
            >
              <span>Lv {level}</span>
              <span className="relative h-4 overflow-hidden rounded-full border-[3px] border-pk-navy-deep bg-white">
                <span
                  className="block h-full rounded-full bg-pk-yellow"
                  style={{ width: `${(experience / top) * 100}%` }}
                />
              </span>
              <span className="text-right">{experience.toLocaleString()}</span>
            </li>
          ))}
      </ul>
    </Panel>
  );
}

function Characteristics({ entry }: { entry: GuideEntry }) {
  const rows = useSuspenseQueries({
    queries: (entry.characteristics ?? []).map((c) =>
      apiQuery<Characteristic>(pathFromUrl(c.url))
    ),
  }).map((result) => result.data);

  return (
    <Panel title="Characteristics">
      <ul className="space-y-1 t-body">
        {[...rows]
          .sort((a, b) => a.gene_modulo - b.gene_modulo)
          .map((row) => (
            <li key={row.id}>
              {firstEnglish(row.descriptions)?.description}
              <span className="ml-2 t-small text-pk-muted">
                IV {row.possible_values.join(', ')}
              </span>
            </li>
          ))}
      </ul>
    </Panel>
  );
}

function StatDetails({ entry }: { entry: GuideEntry }) {
  const moves = entry.affecting_moves;
  const natures = entry.affecting_natures;
  const moveLinks = (
    list: { change: number; move: NamedAPIResource }[]
  ): ChipLink[] =>
    list.map(({ change, move }) => ({
      to: `/move/${move.name}`,
      label: `${getDisplayName(move.name)} ${signed(change)}`,
    }));
  const asResources = (
    list: (
      NamedAPIResource | { max_change: number; nature: NamedAPIResource }
    )[]
  ) => list.map((value) => ('nature' in value ? value.nature : value));
  const effects =
    natures &&
    ([
      ['Natures that raise it', asResources(natures.increase)],
      ['Natures that lower it', asResources(natures.decrease)],
    ] as const);

  return (
    <>
      {effects?.some(([, list]) => list.length) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {effects.map(([title, list]) => (
            <Panel key={title} title={title}>
              <LinkChips items={natureLinks(list)} emptyTitle="None" />
            </Panel>
          ))}
        </div>
      )}
      {moves && moves.increase.length > 0 && (
        <Panel title="Moves that raise it">
          <LinkChips items={moveLinks(moves.increase)} />
        </Panel>
      )}
      {moves && moves.decrease.length > 0 && (
        <Panel title="Moves that lower it">
          <LinkChips items={moveLinks(moves.decrease)} />
        </Panel>
      )}
      {(entry.characteristics?.length ?? 0) > 0 && (
        <Characteristics entry={entry} />
      )}
    </>
  );
}

/** Reads whichever of the shared fields a resource has. */
function EntrySections({
  resource,
  entry,
}: {
  resource: string;
  entry: GuideEntry;
}) {
  const species =
    entry.pokemon_species?.map((pokemon) => ({ pokemon })) ??
    entry.pokemon_species_details?.map((detail) => ({
      pokemon: detail.pokemon_species,
      badge:
        detail.rate < 0 ? 'Genderless' : `${(detail.rate / 8) * 100}% female`,
    })) ??
    entry.pokemon_encounters?.map((encounter) => ({
      pokemon: encounter.pokemon_species,
      badge: `${encounter.base_score} pts · ${encounter.rate}%`,
    }));
  const berries = entry.berries?.map((berry) =>
    'berry' in berry
      ? { name: berry.berry.name, potency: berry.potency }
      : { name: berry.name, potency: 0 }
  );

  return (
    <div className="space-y-4">
      {entry.levels && <ExperienceTable entry={entry} />}
      {(resource === 'stat' || resource === 'pokeathlon-stat') && (
        <StatDetails entry={entry} />
      )}
      {entry.values && (
        <Panel title="Values">
          <ul className="flex flex-wrap gap-2 t-small">
            {entry.values.map((value) => (
              <li
                key={value.name}
                className="rounded-lg border border-pk-line bg-white px-3 py-1"
              >
                {getDisplayName(value.name)}
              </li>
            ))}
          </ul>
        </Panel>
      )}
      {entry.categories && (
        <Panel title="Categories">
          <LinkChips
            items={entry.categories.map((category) => ({
              to: `/items?category=${category.name}`,
              label: getDisplayName(category.name),
            }))}
          />
        </Panel>
      )}
      {entry.version_groups && (
        <Panel title="Games">
          <LinkChips
            items={entry.version_groups.map((group) => ({
              to: `/game/${group.name}`,
              label: versionGroupLabel(group.name),
            }))}
          />
        </Panel>
      )}
      {berries && (
        <Panel title={`${berries.length} berries`}>
          <LinkChips
            items={[...berries]
              .sort((a, b) => b.potency - a.potency)
              .map((berry) => ({
                to: `/berry/${berry.name}`,
                label: berry.potency
                  ? `${getDisplayName(berry.name)} (${berry.potency})`
                  : getDisplayName(berry.name),
              }))}
          />
        </Panel>
      )}
      {entry.items && (
        <Panel title={`${entry.items.length} items`}>
          <ItemLinkGrid items={entry.items} />
        </Panel>
      )}
      {(entry.affecting_items?.length ?? 0) > 0 && (
        <Panel title="Items that raise it">
          <ItemLinkGrid items={entry.affecting_items ?? []} />
        </Panel>
      )}
      {entry.required_for_evolution && (
        <Panel title="Must be this gender to evolve">
          <PokemonLinkGrid
            items={entry.required_for_evolution.map((pokemon) => ({ pokemon }))}
          />
        </Panel>
      )}
      {species && (
        <Panel title={`${species.length} Pokémon`}>
          <PokemonLinkGrid items={species} />
        </Panel>
      )}
      {entry.moves && (
        <Panel title={`${entry.moves.length} moves`}>
          <MoveRowList
            items={entry.moves.map((move) => ({ name: move.name }))}
            resetKey={`${resource}|${entry.id}`}
          />
        </Panel>
      )}
    </div>
  );
}

function EntryFacts({ entry }: { entry: GuideEntry }) {
  const facts: [string, React.ReactNode][] = [];
  if (entry.symbol) facts.push(['Symbol', entry.symbol]);
  if (entry.data_type) facts.push(['Data type', entry.data_type]);
  if (entry.source) facts.push(['Stored on', getDisplayName(entry.source)]);
  if (entry.iso639) facts.push(['Language code', entry.iso639]);
  if (entry.iso3166) facts.push(['Country code', entry.iso3166]);
  if (entry.official !== undefined) {
    facts.push(['Official', entry.official ? 'Yes' : 'No']);
  }
  if (entry.is_battle_only !== undefined) {
    facts.push(['Battle only', entry.is_battle_only ? 'Yes' : 'No']);
  }
  if (entry.move_damage_class) {
    facts.push([
      'Damage class',
      <Link
        key="class"
        to={`/guide/move-damage-class/${entry.move_damage_class.name}`}
      >
        {getDisplayName(entry.move_damage_class.name)}
      </Link>,
    ]);
  }
  if (entry.contest_type) {
    facts.push([
      'Contest type',
      <Link key="type" to={`/guide/contest-type/${entry.contest_type.name}`}>
        {getDisplayName(entry.contest_type.name)}
      </Link>,
    ]);
  }
  if (entry.berry_flavor) {
    facts.push([
      'Berry flavour',
      <Link key="flavour" to={`/guide/berry-flavor/${entry.berry_flavor.name}`}>
        {getDisplayName(entry.berry_flavor.name)}
      </Link>,
    ]);
  }
  if (entry.version_group) {
    facts.push([
      'Introduced in',
      <Link key="game" to={`/game/${entry.version_group.name}`}>
        {versionGroupLabel(entry.version_group.name)}
      </Link>,
    ]);
  }
  if (!facts.length) return null;

  return (
    <dl className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {facts.map(([label, value]) => (
        <StatTile
          key={label}
          label={label}
          value={<span className="t-body">{value}</span>}
        />
      ))}
    </dl>
  );
}

export default function GuideEntryPage() {
  const { resource: id = '', name = '' } = useParams();
  const resource = guideResource(id);
  const entry = useApi<GuideEntry>(`${id}/${name}`);
  const title = englishName(entry.names, name);
  useDocumentTitle(title);

  if (!resource) return <NotFoundPage />;

  const about =
    firstEnglish(entry.descriptions)?.description ??
    firstEnglish(entry.effect_entries)?.effect;

  return (
    <Page>
      <DetailBanner
        back={`/guide/${id}`}
        eyebrow={
          <>
            <Link to="/guide" className="underline underline-offset-2">
              Guide
            </Link>
            {' · '}
            <Link to={`/guide/${id}`} className="underline underline-offset-2">
              {resource.title}
            </Link>
          </>
        }
        title={title}
        subtitle={about}
      />
      <EntryFacts entry={entry} />
      {id === 'nature' && <NatureDetails name={name} />}
      <EntrySections resource={id} entry={entry} />
    </Page>
  );
}
