import React from 'react';
import { useParams } from 'react-router';
import { useRegionData } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import DetailBanner from '../Components/DetailBanner';
import LinkChips from '../Components/LinkChips';
import { Page, Panel, SearchInput } from '../Components/ui';
import { rankMatch } from '../Utils/search';
import {
  englishName,
  formatGeneration,
  getDisplayName,
  locationLabel,
  versionGroupLabel,
} from '../Utils/text';

export default function RegionPage() {
  const { name = '' } = useParams();
  const region = useRegionData(name);
  const title = englishName(region.names, name);
  useDocumentTitle(title);
  const [query, setQuery] = React.useState('');
  const deferred = React.useDeferredValue(query);

  const locations = React.useMemo(
    () =>
      region.locations
        .filter((l) => !deferred || rankMatch(deferred, l.name) !== Infinity)
        .map((l) => ({
          to: `/location/${l.name}`,
          label: locationLabel(l.name, name),
        }))
        .sort((a, b) =>
          a.label.localeCompare(b.label, undefined, { numeric: true })
        ),
    [region, name, deferred]
  );

  return (
    <Page>
      <DetailBanner
        back="/regions"
        eyebrow={
          region.main_generation
            ? `Region · ${formatGeneration(region.main_generation.name)}`
            : 'Region'
        }
        title={title}
        subtitle={`${region.locations.length} locations`}
      />

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Games set here">
          <LinkChips
            emptyTitle="No main-series game is set here"
            items={region.version_groups.map((g) => ({
              to: `/game/${g.name}`,
              label: versionGroupLabel(g.name),
            }))}
          />
        </Panel>
        <Panel title="Pokédexes">
          <LinkChips
            emptyTitle="This region has no Pokédex"
            items={region.pokedexes.map((p) => ({
              to: `/dex/${p.name}`,
              label: getDisplayName(p.name),
            }))}
          />
        </Panel>
      </div>

      <Panel title="Locations">
        <SearchInput
          label="Filter locations"
          placeholder="Filter locations…"
          value={query}
          onChange={setQuery}
          className="mb-4"
        />
        <LinkChips items={locations} emptyTitle="No locations match" />
      </Panel>
    </Page>
  );
}
