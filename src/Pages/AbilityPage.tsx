import React from 'react';
import { Link, useParams } from 'react-router';
import { useAbility } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import DetailBanner from '../Components/DetailBanner';
import PokemonLinkGrid from '../Components/PokemonLinkGrid';
import { Page, Panel, SelectBox } from '../Components/ui';
import { useSelection } from '../Utils/selection';
import {
  englishFlavorText,
  firstEnglish,
  formatGeneration,
  getDisplayName,
  versionGroupLabel,
} from '../Utils/text';

export default function AbilityPage() {
  const { name = '' } = useParams();
  const ability = useAbility(name);
  useDocumentTitle(getDisplayName(name));

  const effect = firstEnglish(ability.effect_entries);
  const flavour = React.useMemo(
    () => englishFlavorText(ability.flavor_text_entries),
    [ability]
  );
  const { game } = useSelection();
  const [group, setGroup] = React.useState(
    flavour.find((f) => f.version_group?.name === game)?.version_group?.name ??
      flavour.at(-1)?.version_group?.name ??
      ''
  );
  const flavourText = flavour.find((f) => f.version_group?.name === group);

  return (
    <Page>
      <DetailBanner
        back="/abilities"
        eyebrow={
          <>
            Ability ·{' '}
            <Link
              to={`/generation/${ability.generation.name}`}
              className="underline underline-offset-2"
            >
              {formatGeneration(ability.generation.name)}
            </Link>
          </>
        }
        title={getDisplayName(name)}
        subtitle={effect?.short_effect}
      />

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Panel title="What it does">
          <p className="t-body">
            {effect?.effect ?? 'No description available.'}
          </p>
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

      {ability.effect_changes.length > 0 && (
        <Panel title="How it has changed" className="mb-4">
          <ul className="space-y-2 t-body">
            {ability.effect_changes.map((change) => (
              <li key={change.version_group.name}>
                <span className="t-small text-pk-muted">
                  Before {versionGroupLabel(change.version_group.name)}:
                </span>{' '}
                {firstEnglish(change.effect_entries)?.effect}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel title={`${ability.pokemon.length} Pokémon have this ability`}>
        <PokemonLinkGrid
          items={ability.pokemon.map(({ pokemon, is_hidden }) => ({
            pokemon,
            badge: is_hidden ? 'Hidden' : undefined,
          }))}
          emptyTitle="No Pokémon have this ability"
        />
      </Panel>
    </Page>
  );
}
