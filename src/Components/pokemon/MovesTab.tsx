import React from 'react';
import { useVersionGroups } from '../../api/pokeapi';
import { rankMatch } from '../../Utils/search';
import { compareVersionGroups, versionGroupLabel } from '../../Utils/text';
import MoveRowList from '../MoveRowList';
import { EmptyState, Panel, SearchInput, SelectBox, Tabs } from '../ui';
import type { Pokemon } from '../../types/pokeapi';

const METHODS = [
  { id: 'level-up', label: 'Level up' },
  { id: 'machine', label: 'TM / HM' },
  { id: 'egg', label: 'Egg' },
  { id: 'tutor', label: 'Tutor' },
  { id: 'other', label: 'Other' },
] as const;
type MethodId = (typeof METHODS)[number]['id'];

interface LearnedMove {
  name: string;
  level: number;
  method: MethodId;
}

interface MovesTabProps {
  pokemon: Pokemon;
  /** The game chosen in the URL, if any */
  game: string | null;
  onGameChange: (game: string) => void;
}

export default function MovesTab({
  pokemon,
  game,
  onGameChange,
}: MovesTabProps) {
  const groups = useVersionGroups();
  const [method, setMethod] = React.useState<MethodId | null>(null);
  const [filter, setFilter] = React.useState('');

  // only games this Pokémon appears in, oldest first
  const games = React.useMemo(() => {
    const available = new Set(
      pokemon.moves.flatMap((m) =>
        m.version_group_details.map((d) => d.version_group.name)
      )
    );
    return groups.results
      .map((g) => g.name)
      .filter((name) => available.has(name))
      .sort(compareVersionGroups);
  }, [pokemon, groups]);

  // newest game where it learns moves by level (the very latest entries can
  // hold little more than a handful of event moves)
  const mainGame = games.findLast((name) =>
    pokemon.moves.some((m) =>
      m.version_group_details.some(
        (d) =>
          d.version_group.name === name &&
          d.move_learn_method.name === 'level-up'
      )
    )
  );
  const selectedGame =
    game && games.includes(game) ? game : (mainGame ?? games.at(-1));

  const learned = React.useMemo<LearnedMove[]>(() => {
    if (!selectedGame) return [];
    return pokemon.moves.flatMap((m) =>
      m.version_group_details
        .filter((d) => d.version_group.name === selectedGame)
        .map((d) => {
          const known = METHODS.some((x) => x.id === d.move_learn_method.name);
          return {
            name: m.move.name,
            level: d.level_learned_at,
            method: (known ? d.move_learn_method.name : 'other') as MethodId,
          };
        })
    );
  }, [pokemon, selectedGame]);

  const counts = METHODS.map((m) => ({
    ...m,
    count: learned.filter((move) => move.method === m.id).length,
  })).filter((m) => m.count > 0);

  const activeMethod =
    method && counts.some((m) => m.id === method) ? method : counts[0]?.id;

  const visible = React.useMemo(() => {
    const list = learned
      .filter((move) => move.method === activeMethod)
      .filter((move) => !filter || rankMatch(filter, move.name) !== Infinity);
    return list.sort((a, b) =>
      activeMethod === 'level-up' && a.level !== b.level
        ? a.level - b.level
        : a.name.localeCompare(b.name)
    );
  }, [learned, activeMethod, filter]);

  if (!games.length || !selectedGame || !activeMethod) {
    return (
      <EmptyState title="No moves recorded">
        PokeAPI has no move data for this Pokémon yet.
      </EmptyState>
    );
  }

  return (
    <Panel
      title="Moves"
      actions={
        <SelectBox
          label="Game"
          value={selectedGame}
          onChange={onGameChange}
          className="w-64"
        >
          {games.map((name) => (
            <option key={name} value={name}>
              {versionGroupLabel(name)}
            </option>
          ))}
        </SelectBox>
      }
    >
      <Tabs
        tabs={counts.map((m) => ({
          id: m.id,
          label: `${m.label} (${m.count})`,
        }))}
        value={activeMethod}
        onChange={setMethod}
        className="mb-4"
      />
      <SearchInput
        label="Filter moves"
        placeholder="Filter these moves…"
        value={filter}
        onChange={setFilter}
        className="mb-4"
      />
      <MoveRowList
        items={visible.map((move) => ({
          name: move.name,
          level: activeMethod === 'level-up' ? move.level : undefined,
        }))}
        resetKey={`${selectedGame}|${activeMethod}|${filter}`}
        emptyTitle="No moves here"
      />
    </Panel>
  );
}
