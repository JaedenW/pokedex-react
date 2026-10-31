import { Link, useParams } from 'react-router';
import { idFromUrl, useApi } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import DetailBanner from '../Components/DetailBanner';
import LinkChips from '../Components/LinkChips';
import PokemonLinkGrid from '../Components/PokemonLinkGrid';
import TypeBadge from '../Components/TypeBadge';
import { Page, Panel, StatTile } from '../Components/ui';
import {
  formatGeneration,
  getDisplayName,
  versionGroupLabel,
} from '../Utils/text';
import type { Generation } from '../types/pokeapi';

export default function GenerationPage() {
  const { name = '' } = useParams();
  const generation = useApi<Generation>(`generation/${name}`);
  const title = formatGeneration(name);
  useDocumentTitle(title);

  const species = [...generation.pokemon_species].sort(
    (a, b) => idFromUrl(a.url) - idFromUrl(b.url)
  );

  return (
    <Page>
      <DetailBanner
        back="/generations"
        eyebrow="Generation"
        title={title}
        subtitle={
          <Link
            to={`/region/${generation.main_region.name}`}
            className="underline underline-offset-2"
          >
            {getDisplayName(generation.main_region.name)} region
          </Link>
        }
      />

      <dl className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatTile
          label="New Pokémon"
          value={generation.pokemon_species.length}
        />
        <StatTile label="New moves" value={generation.moves.length} />
        <StatTile label="New abilities" value={generation.abilities.length} />
        <StatTile label="New types" value={generation.types.length} />
      </dl>

      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Games">
            <LinkChips
              items={generation.version_groups.map((g) => ({
                to: `/game/${g.name}`,
                label: versionGroupLabel(g.name),
              }))}
            />
          </Panel>
          {generation.types.length > 0 && (
            <Panel title="New types">
              <div className="flex flex-wrap gap-2">
                {generation.types.map((type) => (
                  <TypeBadge key={type.name} name={type.name} />
                ))}
              </div>
            </Panel>
          )}
        </div>
        <Panel title="New Pokémon">
          <PokemonLinkGrid
            items={species.map((pokemon) => ({ pokemon }))}
            emptyTitle="No new Pokémon"
          />
        </Panel>
        <Panel title="New moves">
          <LinkChips
            emptyTitle="No new moves"
            items={generation.moves.map((m) => ({
              to: `/move/${m.name}`,
              label: getDisplayName(m.name),
            }))}
          />
        </Panel>
        {generation.abilities.length > 0 && (
          <Panel title="New abilities">
            <LinkChips
              items={generation.abilities.map((a) => ({
                to: `/ability/${a.name}`,
                label: getDisplayName(a.name),
              }))}
            />
          </Panel>
        )}
      </div>
    </Page>
  );
}
