import { useSuspenseQueries } from '@tanstack/react-query';
import { apiQuery, useApi } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import { useGame } from '../Hooks/useGame';
import PageHeader from '../Components/PageHeader';
import SectionTabs, { WORLD_TABS } from '../Components/SectionTabs';
import TileLink from '../Components/TileLink';
import { Page, Pill } from '../Components/ui';
import { generationNumber } from '../Utils/games';
import { formatGeneration, getDisplayName } from '../Utils/text';
import type { Generation, NamedAPIResourceList } from '../types/pokeapi';

export default function GenerationsPage() {
  useDocumentTitle('Generations');
  const list = useApi<NamedAPIResourceList>('generation?limit=30');
  const generations = useSuspenseQueries({
    queries: list.results.map((g) =>
      apiQuery<Generation>(`generation/${g.name}`)
    ),
  }).map((result) => result.data);
  const { generation: selected } = useGame();

  return (
    <Page wide>
      <PageHeader
        title="Generations"
        subtitle={`${generations.length} generations of Pokémon`}
      />
      <SectionTabs tabs={WORLD_TABS} />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {generations.map((generation) => {
          const current = generationNumber(generation.name) === selected;
          return (
            <li key={generation.name}>
              <TileLink
                to={`/generation/${generation.name}`}
                title={formatGeneration(generation.name)}
                current={current}
                badge={
                  current ? <Pill colour="#0a285f">Your game</Pill> : undefined
                }
              >
                {getDisplayName(generation.main_region.name)} ·{' '}
                {generation.pokemon_species.length} new Pokémon ·{' '}
                {generation.moves.length} new moves
              </TileLink>
            </li>
          );
        })}
      </ul>
    </Page>
  );
}
