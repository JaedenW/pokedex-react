import { useSuspenseQueries } from '@tanstack/react-query';
import { apiQuery, useApi } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import { useGame } from '../Hooks/useGame';
import PageHeader from '../Components/PageHeader';
import SectionTabs, { WORLD_TABS } from '../Components/SectionTabs';
import TileLink from '../Components/TileLink';
import { Page, Pill } from '../Components/ui';
import { formatGeneration, getDisplayName } from '../Utils/text';
import type { NamedAPIResourceList, Region } from '../types/pokeapi';

export default function RegionsPage() {
  useDocumentTitle('Regions');
  const list = useApi<NamedAPIResourceList>('region?limit=100');
  const regions = useSuspenseQueries({
    queries: list.results.map((r) => apiQuery<Region>(`region/${r.name}`)),
  }).map((result) => result.data);
  const { group } = useGame();
  const inGame = new Set(group?.regions.map((r) => r.name));

  return (
    <Page wide>
      <PageHeader title="Regions" subtitle={`${regions.length} regions`} />
      <SectionTabs tabs={WORLD_TABS} />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((region) => (
          <li key={region.name}>
            <TileLink
              to={`/region/${region.name}`}
              title={getDisplayName(region.name)}
              current={inGame.has(region.name)}
              badge={
                inGame.has(region.name) ? (
                  <Pill colour="#0a285f">Your game</Pill>
                ) : undefined
              }
            >
              {region.locations.length} locations
              {region.main_generation &&
                ` · ${formatGeneration(region.main_generation.name)}`}
            </TileLink>
          </li>
        ))}
      </ul>
    </Page>
  );
}
