import React from 'react';
import { useSelection } from '../Utils/selection';
import { englishFlavorText, versionGroupLabel } from '../Utils/text';
import { Panel, SelectBox } from './ui';
import type { FlavorTextEntry } from '../types/pokeapi';

/** The text a game shows for a move, item or ability, picked by game. */
export default function GameTextPanel({
  entries,
}: {
  entries: FlavorTextEntry[];
}) {
  const { game } = useSelection();
  const flavour = React.useMemo(() => englishFlavorText(entries), [entries]);
  // a pick only lasts until the selected game changes
  const [picked, setPicked] = React.useState<{
    game: string | null;
    group: string;
  }>();

  const has = (group?: string | null) =>
    flavour.some((f) => f.version_group?.name === group);
  const group =
    picked?.game === game && has(picked.group)
      ? picked.group
      : has(game)
        ? game
        : flavour.at(-1)?.version_group?.name;

  if (!flavour.length) return null;

  return (
    <Panel
      title="In-game text"
      actions={
        <SelectBox
          label="Game"
          value={group ?? ''}
          onChange={(value) => setPicked({ game, group: value })}
          className="w-56"
        >
          {flavour.map((f) => (
            <option key={f.version_group?.name} value={f.version_group?.name}>
              {versionGroupLabel(f.version_group?.name ?? '')}
            </option>
          ))}
        </SelectBox>
      }
    >
      <p className="t-body">
        {flavour.find((f) => f.version_group?.name === group)?.flavor_text}
      </p>
    </Panel>
  );
}
