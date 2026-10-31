import { Link, useParams } from 'react-router';
import { useApi } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import AreaEncounters from '../Components/AreaEncounters';
import DetailBanner from '../Components/DetailBanner';
import { Page, Panel } from '../Components/ui';
import { englishName, getDisplayName } from '../Utils/text';
import type { LocationArea } from '../types/pokeapi';

export default function AreaPage() {
  const { name = '' } = useParams();
  const area = useApi<LocationArea>(`location-area/${name}`);
  const title = englishName(area.names, name);
  useDocumentTitle(title);

  return (
    <Page>
      <DetailBanner
        back={`/location/${area.location.name}`}
        eyebrow={
          <Link
            to={`/location/${area.location.name}`}
            className="underline underline-offset-2"
          >
            {getDisplayName(area.location.name)}
          </Link>
        }
        title={title}
      />
      <Panel title="Wild Pokémon">
        <AreaEncounters name={name} />
      </Panel>
    </Page>
  );
}
