import React from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { idFromUrl, usePokedexData, useApi, useTypeData } from '../api/pokeapi';
import { typeIconUrl } from '../api/sprites';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import DetailBanner from '../Components/DetailBanner';
import PokemonGrid from '../Components/PokemonGrid';
import type { GridEntry } from '../Components/PokemonCard';
import TypeBadge from '../Components/TypeBadge';
import { Page, Panel, SelectBox, buttonClass } from '../Components/ui';
import { DEFAULT_DEX, useDexName } from '../Utils/dex';
import { typeColours } from '../Utils/typeColours';
import { getDisplayName } from '../Utils/text';
import type { NamedAPIResourceList } from '../types/pokeapi';

const SIDES: { title: string; rows: { label: string; key: string }[] }[] = [
  {
    title: 'Attacking',
    rows: [
      { label: 'Super effective against', key: 'double_damage_to' },
      { label: 'Not very effective against', key: 'half_damage_to' },
      { label: 'No effect on', key: 'no_damage_to' },
    ],
  },
  {
    title: 'Defending',
    rows: [
      { label: 'Weak to', key: 'double_damage_from' },
      { label: 'Resists', key: 'half_damage_from' },
      { label: 'Immune to', key: 'no_damage_from' },
    ],
  },
];

export default function TypePage() {
  const { name = '' } = useParams();
  const type = useTypeData(name);
  const [, setParams] = useSearchParams();
  const pokedexName = useDexName();
  const dex = usePokedexData(pokedexName);
  const dexes = useApi<NamedAPIResourceList>('pokedex?limit=100');
  useDocumentTitle(`${getDisplayName(name)} type`);

  const entries = React.useMemo<GridEntry[]>(() => {
    const members = new Set(type.pokemon.map((p) => idFromUrl(p.pokemon.url)));
    return dex.pokemon_entries
      .filter((entry) => members.has(idFromUrl(entry.pokemon_species.url)))
      .map((entry) => ({
        species: entry.pokemon_species,
        number: entry.entry_number,
      }));
  }, [type, dex]);

  const colour = typeColours[name] ?? '#68A090';

  return (
    <Page wide>
      <DetailBanner
        back="/types"
        colour={colour}
        eyebrow="Type"
        title={getDisplayName(name)}
        subtitle={`${type.pokemon.length} Pokémon and ${type.moves.length} moves`}
        badges={
          <Link
            to={`/moves?type=${name}`}
            className={buttonClass('primary', 'sm')}
          >
            Browse {getDisplayName(name)} moves
          </Link>
        }
        media={
          typeIconUrl(name) && (
            <span
              className="inline-flex size-16 rounded-full shadow-card sm:size-24"
              style={{ backgroundColor: colour }}
            >
              <img src={typeIconUrl(name)} alt="" className="size-full" />
            </span>
          )
        }
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        {SIDES.map(({ title, rows }) => (
          <Panel key={title} title={title}>
            <dl className="space-y-4">
              {rows.map(({ label, key }) => {
                const types = type.damage_relations[key] ?? [];
                return (
                  <div key={key}>
                    <dt className="mb-2 t-label text-pk-muted">{label}</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {types.length ? (
                        types.map((t) => (
                          <TypeBadge key={t.name} name={t.name} size="sm" />
                        ))
                      ) : (
                        <span className="t-small text-pk-muted">None</span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </Panel>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="t-h2">
          {getDisplayName(name)} Pokémon{' '}
          <span className="text-pk-muted">({entries.length})</span>
        </h2>
        <SelectBox
          label="Pokédex"
          value={pokedexName}
          onChange={(value) =>
            setParams(value === DEFAULT_DEX ? {} : { dex: value }, {
              replace: true,
            })
          }
          className="w-64"
        >
          {dexes.results.map((d) => (
            <option key={d.name} value={d.name}>
              {getDisplayName(d.name)}
            </option>
          ))}
        </SelectBox>
      </div>
      <PokemonGrid
        entries={entries}
        resetKey={`${name}|${pokedexName}`}
        emptyTitle={`No ${getDisplayName(name)} Pokémon in this Pokédex`}
        emptyHint="Pick another Pokédex above."
      />
    </Page>
  );
}
