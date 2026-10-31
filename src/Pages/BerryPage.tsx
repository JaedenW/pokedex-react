import { Link, useParams } from 'react-router';
import { useApi, useItem } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import DetailBanner from '../Components/DetailBanner';
import ItemImage from '../Components/ItemImage';
import TypeBadge from '../Components/TypeBadge';
import { Page, Panel, StatTile, buttonClass } from '../Components/ui';
import { firstEnglish, getDisplayName } from '../Utils/text';
import type { Berry } from '../types/pokeapi';

// the strongest flavour on any berry
const MAX_POTENCY = 40;

export default function BerryPage() {
  const { name = '' } = useParams();
  const berry = useApi<Berry>(`berry/${name}`);
  const item = useItem(berry.item.name);
  const title = `${getDisplayName(name)} Berry`;
  useDocumentTitle(title);
  const effect = firstEnglish(item.effect_entries);

  return (
    <Page>
      <DetailBanner
        back="/berries"
        eyebrow={
          <Link to="/berries" className="underline underline-offset-2">
            Berries
          </Link>
        }
        title={title}
        subtitle={effect?.short_effect}
        badges={
          <Link
            to={`/item/${berry.item.name}`}
            className={buttonClass('secondary', 'sm')}
          >
            View as an item
          </Link>
        }
        media={
          <ItemImage
            name={berry.item.name}
            className="size-20 rounded-xl border border-pk-line bg-white p-2 sm:size-28"
          />
        }
      />

      <dl className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile
          label="Firmness"
          value={
            <Link
              to={`/guide/berry-firmness/${berry.firmness.name}`}
              className="t-body"
            >
              {getDisplayName(berry.firmness.name)}
            </Link>
          }
        />
        <StatTile label="Size" value={`${berry.size} mm`} />
        <StatTile label="Growth" value={`${berry.growth_time} h`} />
        <StatTile label="Max harvest" value={berry.max_harvest} />
        <StatTile label="Smoothness" value={berry.smoothness} />
        <StatTile label="Soil dryness" value={berry.soil_dryness} />
      </dl>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Flavours">
          <ul className="space-y-2">
            {berry.flavors.map(({ flavor, potency }) => (
              <li
                key={flavor.name}
                className="grid grid-cols-[5rem_1fr_2rem] items-center gap-2 t-body"
              >
                <Link
                  to={`/guide/berry-flavor/${flavor.name}`}
                  className="font-bold text-pk-navy underline-offset-2 hover:underline"
                >
                  {getDisplayName(flavor.name)}
                </Link>
                <span className="relative h-4 overflow-hidden rounded-full border-[3px] border-pk-navy-deep bg-white">
                  <span
                    className="block h-full rounded-full bg-pk-yellow"
                    style={{ width: `${(potency / MAX_POTENCY) * 100}%` }}
                  />
                </span>
                <span className="text-right">{potency}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Natural Gift">
          <div className="flex items-center gap-3">
            <TypeBadge name={berry.natural_gift_type.name} icon />
            <span className="t-body">Power {berry.natural_gift_power}</span>
          </div>
          {effect && <p className="mt-4 t-body">{effect.effect}</p>}
        </Panel>
      </div>
    </Page>
  );
}
