import React from 'react';
import { Link, useParams } from 'react-router';
import { useItem } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import DetailBanner from '../Components/DetailBanner';
import ItemImage from '../Components/ItemImage';
import PokemonLinkGrid from '../Components/PokemonLinkGrid';
import { Page, Panel, Pill, SelectBox } from '../Components/ui';
import {
  englishFlavorText,
  firstEnglish,
  getDisplayName,
  versionGroupLabel,
} from '../Utils/text';

export default function ItemPage() {
  const { name = '' } = useParams();
  const item = useItem(name);
  useDocumentTitle(getDisplayName(name));

  const effect = firstEnglish(item.effect_entries);
  const flavour = React.useMemo(
    () => englishFlavorText(item.flavor_text_entries),
    [item]
  );
  const [group, setGroup] = React.useState(
    flavour.at(-1)?.version_group?.name ?? ''
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
              <Pill key={attribute.name} colour="#0a285f">
                {getDisplayName(attribute.name)}
              </Pill>
            ))}
            {item.fling_power !== null && (
              <Pill colour="#C22E28">Fling power {item.fling_power}</Pill>
            )}
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
