import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import { useGamesByGeneration } from '../Hooks/useGame';
import PageHeader from '../Components/PageHeader';
import SectionTabs, { WORLD_TABS } from '../Components/SectionTabs';
import TileLink from '../Components/TileLink';
import { Page, Panel, Pill } from '../Components/ui';
import { useSelection } from '../Utils/selection';
import {
  formatGeneration,
  getDisplayName,
  versionGroupLabel,
  versionLabel,
} from '../Utils/text';

export default function GamesPage() {
  useDocumentTitle('Games');
  const { game } = useSelection();
  const { games, generations } = useGamesByGeneration();

  return (
    <Page wide>
      <PageHeader title="Games" subtitle={`${games.length} games and DLC`} />
      <SectionTabs tabs={WORLD_TABS} />
      <div className="space-y-4">
        {generations.map(([number, items]) => (
          <Panel
            key={number}
            title={formatGeneration(items[0].generation.name)}
          >
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <li key={item.name}>
                  <TileLink
                    to={`/game/${item.name}`}
                    title={versionGroupLabel(item.name)}
                    current={item.name === game}
                    badge={
                      item.name === game ? (
                        <Pill colour="#0a285f">Selected</Pill>
                      ) : undefined
                    }
                  >
                    {item.versions.map((v) => versionLabel(v.name)).join(', ')}
                    {item.regions.length > 0 &&
                      ` · ${item.regions.map((r) => getDisplayName(r.name)).join(', ')}`}
                  </TileLink>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </Page>
  );
}
