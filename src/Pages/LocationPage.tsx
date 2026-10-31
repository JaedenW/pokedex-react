import React from 'react';
import { Link, useParams } from 'react-router';
import { useApi } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import AreaEncounters from '../Components/AreaEncounters';
import DetailBanner from '../Components/DetailBanner';
import { EmptyState, Loading, Page, Panel } from '../Components/ui';
import {
  englishName,
  formatGeneration,
  getDisplayName,
  locationLabel,
} from '../Utils/text';
import type { Location } from '../types/pokeapi';

export default function LocationPage() {
  const { name = '' } = useParams();
  const location = useApi<Location>(`location/${name}`);
  const title = englishName(location.names, name);
  const region = location.region?.name;
  useDocumentTitle(title);

  return (
    <Page>
      <DetailBanner
        back={region ? `/region/${region}` : '/regions'}
        eyebrow={
          region ? (
            <Link
              to={`/region/${region}`}
              className="underline underline-offset-2"
            >
              {getDisplayName(region)}
            </Link>
          ) : (
            'Location'
          )
        }
        title={title}
        subtitle={
          location.game_indices.length > 0
            ? `Appears in ${[
                ...new Set(
                  location.game_indices.map((g) =>
                    formatGeneration(g.generation.name)
                  )
                ),
              ].join(', ')}`
            : undefined
        }
      />

      {location.areas.length ? (
        <div className="space-y-4">
          {location.areas.map((area) => (
            <Panel
              key={area.name}
              title={
                location.areas.length > 1
                  ? locationLabel(area.name.replace(`${name}-`, ''))
                  : 'Wild Pokémon'
              }
            >
              <React.Suspense fallback={<Loading className="h-24" />}>
                <AreaEncounters name={area.name} />
              </React.Suspense>
            </Panel>
          ))}
        </div>
      ) : (
        <EmptyState title="No encounter data for this location">
          It may be a story location with no wild Pokémon.
        </EmptyState>
      )}
    </Page>
  );
}
