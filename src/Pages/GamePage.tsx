import { Link, useParams } from 'react-router';
import { useVersionGroup } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import { useGameRoster } from '../Hooks/useGame';
import DetailBanner from '../Components/DetailBanner';
import LinkChips from '../Components/LinkChips';
import { Page, Panel, StatTile, buttonClass } from '../Components/ui';
import { generationNumber } from '../Utils/games';
import { useSelection } from '../Utils/selection';
import {
  formatGeneration,
  getDisplayName,
  versionGroupLabel,
  versionLabel,
} from '../Utils/text';
import { typesInGeneration } from '../Utils/teamPlan';

export default function GamePage() {
  const { name = '' } = useParams();
  const group = useVersionGroup(name);
  const { game, chooseGame } = useSelection();
  const roster = useGameRoster(group.pokedexes.map((p) => p.name));
  const label = versionGroupLabel(name);
  const generation = generationNumber(group.generation.name);
  useDocumentTitle(label);

  const selected = game === name;

  return (
    <Page>
      <DetailBanner
        back="/games"
        eyebrow={
          <Link
            to={`/generation/${group.generation.name}`}
            className="underline underline-offset-2"
          >
            {formatGeneration(group.generation.name)}
          </Link>
        }
        title={label}
        subtitle={group.versions.map((v) => versionLabel(v.name)).join(', ')}
        badges={
          <button
            type="button"
            disabled={selected}
            onClick={() => void chooseGame(name)}
            className={buttonClass('primary', 'md')}
          >
            {selected ? 'This is your selected game' : 'Use this game'}
          </button>
        }
      />

      <dl className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatTile label="Pokémon" value={roster?.size ?? '—'} />
        <StatTile label="Types" value={typesInGeneration(generation).length} />
        <StatTile label="Pokédexes" value={group.pokedexes.length} />
        <StatTile label="Regions" value={group.regions.length} />
      </dl>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Pokédexes">
          <LinkChips
            emptyTitle="This game has no Pokédex of its own"
            items={group.pokedexes.map((p) => ({
              to: `/dex/${p.name}`,
              label: getDisplayName(p.name),
            }))}
          />
        </Panel>
        <Panel title="Regions">
          <LinkChips
            emptyTitle="No region is recorded for this game"
            items={group.regions.map((r) => ({
              to: `/region/${r.name}`,
              label: getDisplayName(r.name),
            }))}
          />
        </Panel>
        <Panel title="Ways to learn moves">
          <LinkChips
            items={group.move_learn_methods.map((m) => ({
              to: `/guide/move-learn-method/${m.name}`,
              label: getDisplayName(m.name),
            }))}
          />
        </Panel>
        <Panel title="In this game">
          <div className="flex flex-wrap gap-2">
            <Link
              to="/machines"
              onClick={() => void chooseGame(name)}
              className={buttonClass('secondary', 'sm')}
            >
              TMs &amp; HMs
            </Link>
            <Link
              to={`/team?game=${name}`}
              className={buttonClass('secondary', 'sm')}
            >
              Plan a team
            </Link>
          </div>
        </Panel>
      </div>
    </Page>
  );
}
