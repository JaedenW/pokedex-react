import React from 'react';
import { Link, useParams } from 'react-router';
import { useSuspenseQueries } from '@tanstack/react-query';
import { apiQuery, pathFromUrl, useApi, useItem } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import DetailBanner from '../Components/DetailBanner';
import ItemImage from '../Components/ItemImage';
import PokemonLinkGrid from '../Components/PokemonLinkGrid';
import {
  Loading,
  Page,
  Panel,
  Pill,
  SelectBox,
  buttonClass,
} from '../Components/ui';
import { useSelection } from '../Utils/selection';
import { cn } from '../Utils/cn';
import {
  compareVersionGroups,
  englishFlavorText,
  firstEnglish,
  getDisplayName,
  versionGroupLabel,
} from '../Utils/text';
import type { Item, ItemCategory, Machine } from '../types/pokeapi';

const priceText = (value: number | null, currency: string) =>
  value === null
    ? '—'
    : `${value.toLocaleString()}${currency === 'poke-dollar' ? '' : ` ${getDisplayName(currency)}`}`;

/** Buying and selling prices, with the selected game listed first. */
function Prices({ item, game }: { item: Item; game: string | null }) {
  const rows = [...item.prices]
    .filter((p) => p.purchase_price !== null || p.sell_price !== null)
    .sort(
      (a, b) =>
        Number(b.version_group.name === game) -
          Number(a.version_group.name === game) ||
        compareVersionGroups(a.version_group.name, b.version_group.name)
    );
  if (!rows.length) return null;

  return (
    <Panel title="Prices" className="mb-4">
      <div className="overflow-x-auto">
        <table className="w-full t-small">
          <thead>
            <tr className="t-label text-pk-muted">
              <th className="text-left font-normal">Game</th>
              <th className="text-right font-normal">Buy</th>
              <th className="text-right font-normal">Sell</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={`${row.version_group.name}${row.currency.name}`}
                className={cn(
                  row.version_group.name === game && 'font-bold text-pk-navy'
                )}
              >
                <td>
                  <Link
                    to={`/game/${row.version_group.name}`}
                    className="underline-offset-2 hover:underline"
                  >
                    {versionGroupLabel(row.version_group.name)}
                  </Link>
                </td>
                <td className="text-right">
                  {priceText(row.purchase_price, row.currency.name)}
                </td>
                <td className="text-right">
                  {priceText(row.sell_price, row.currency.name)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function Machines({ item }: { item: Item }) {
  const machines = useSuspenseQueries({
    queries: item.machines.map(({ machine }) =>
      apiQuery<Machine>(pathFromUrl(machine.url))
    ),
  }).map((result) => result.data);

  return (
    <Panel title="Teaches, by game" className="mb-4">
      <ul className="grid gap-x-4 gap-y-0.5 t-small sm:grid-cols-2 lg:grid-cols-3">
        {[...machines]
          .sort((a, b) =>
            compareVersionGroups(a.version_group.name, b.version_group.name)
          )
          .map((machine) => (
            <li key={machine.id} className="flex justify-between gap-3">
              <Link
                to={`/game/${machine.version_group.name}`}
                className="underline-offset-2 hover:underline"
              >
                {versionGroupLabel(machine.version_group.name)}
              </Link>
              <Link
                to={`/move/${machine.move.name}`}
                className="font-bold text-pk-navy underline-offset-2 hover:underline"
              >
                {getDisplayName(machine.move.name)}
              </Link>
            </li>
          ))}
      </ul>
    </Panel>
  );
}

export default function ItemPage() {
  const { name = '' } = useParams();
  const item = useItem(name);
  useDocumentTitle(getDisplayName(name));

  const effect = firstEnglish(item.effect_entries);
  const flavour = React.useMemo(
    () => englishFlavorText(item.flavor_text_entries),
    [item]
  );
  const { game } = useSelection();
  const category = useApi<ItemCategory>(`item-category/${item.category.name}`);
  const [group, setGroup] = React.useState(
    flavour.find((f) => f.version_group?.name === game)?.version_group?.name ??
      flavour.at(-1)?.version_group?.name ??
      ''
  );
  const flavourText = flavour.find((f) => f.version_group?.name === group);

  return (
    <Page>
      <DetailBanner
        back="/items"
        eyebrow={
          <Link
            to={`/items?category=${item.category.name}`}
            className="underline underline-offset-2"
          >
            {getDisplayName(item.category.name)}
          </Link>
        }
        badges={
          <Link
            to={`/guide/item-pocket/${category.pocket.name}`}
            className={buttonClass('secondary', 'sm')}
          >
            {getDisplayName(category.pocket.name)} pocket
          </Link>
        }
        title={getDisplayName(name)}
        subtitle={effect?.short_effect}
        media={
          <ItemImage
            name={name}
            className="size-20 rounded-xl border border-pk-line bg-white p-2 sm:size-28"
          />
        }
      />

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Panel title="What it does">
          <p className="t-body">
            {effect?.effect ??
              effect?.short_effect ??
              'No description available.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.attributes.map((attribute) => (
              <Link
                key={attribute.name}
                to={`/guide/item-attribute/${attribute.name}`}
              >
                <Pill colour="#0a285f">{getDisplayName(attribute.name)}</Pill>
              </Link>
            ))}
            {item.fling_power !== null &&
              (item.fling_effect ? (
                <Link to={`/guide/item-fling-effect/${item.fling_effect.name}`}>
                  <Pill colour="#C22E28">Fling power {item.fling_power}</Pill>
                </Link>
              ) : (
                <Pill colour="#C22E28">Fling power {item.fling_power}</Pill>
              ))}
          </div>
        </Panel>
        {flavour.length > 0 && (
          <Panel
            title="In-game text"
            actions={
              <SelectBox
                label="Game"
                value={group}
                onChange={setGroup}
                className="w-56"
              >
                {flavour.map((f) => (
                  <option
                    key={f.version_group?.name}
                    value={f.version_group?.name}
                  >
                    {versionGroupLabel(f.version_group?.name ?? '')}
                  </option>
                ))}
              </SelectBox>
            }
          >
            <p className="t-body">{flavourText?.flavor_text}</p>
          </Panel>
        )}
      </div>

      {(item.prices?.length ?? 0) > 0 && <Prices item={item} game={game} />}

      {item.machines.length > 0 && (
        <React.Suspense fallback={<Loading className="h-24" />}>
          <Machines item={item} />
        </React.Suspense>
      )}

      {item.held_by_pokemon.length > 0 && (
        <Panel title={`Held by ${item.held_by_pokemon.length} wild Pokémon`}>
          <PokemonLinkGrid
            items={item.held_by_pokemon.map(({ pokemon }) => ({ pokemon }))}
          />
        </Panel>
      )}
    </Page>
  );
}
