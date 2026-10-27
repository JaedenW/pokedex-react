import React from 'react';
import { useSearchParams } from 'react-router';
import { useVersionGroup, useVersionGroups } from '../api/pokeapi';
import { useGameRoster } from '../Hooks/useGame';
import { useSelection } from '../Utils/selection';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import PageHeader from '../Components/PageHeader';
import { CheckIcon, LinkIcon, PlusIcon } from '../Components/Icons';
import MemberCard from '../Components/team/MemberCard';
import TeamAnalysis from '../Components/team/TeamAnalysis';
import { PokemonPicker } from '../Components/team/TeamPickers';
import {
  EmptyState,
  Loading,
  Page,
  Panel,
  SelectBox,
  buttonClass,
} from '../Components/ui';
import { DEFAULT_GAME, generationNumber } from '../Utils/games';
import {
  MAX_TEAM,
  parseTeam,
  serializeTeam,
  typesInGeneration,
  type TeamMember,
} from '../Utils/teamPlan';
import { compareVersionGroups, versionGroupLabel } from '../Utils/text';

export default function TeamPage() {
  useDocumentTitle('Team planner');
  const [params, setParams] = useSearchParams();
  const [isPending, startTransition] = React.useTransition();
  const [picking, setPicking] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const selection = useSelection();
  const urlGame = params.get('game');
  // the link's game wins, then the selected one
  const game = urlGame ?? selection.game ?? DEFAULT_GAME;

  // a shared link's game becomes the selected game
  const { chooseGame } = selection;
  React.useEffect(() => {
    if (urlGame) void chooseGame(urlGame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const teamParam = params.get('team');
  const team = React.useMemo(() => parseTeam(teamParam), [teamParam]);

  const groups = useVersionGroups();
  const versionGroup = useVersionGroup(game);
  const generation = generationNumber(versionGroup.generation.name);
  const roster = useGameRoster(versionGroup.pokedexes.map((p) => p.name));
  const games = React.useMemo(
    () => groups.results.map((g) => g.name).sort(compareVersionGroups),
    [groups]
  );

  function update(next: { team?: TeamMember[] }) {
    startTransition(() => {
      setParams(
        (current) => {
          const updated = new URLSearchParams(current);
          if (next.team) {
            const value = serializeTeam(next.team);
            if (value) updated.set('team', value);
            else updated.delete('team');
          }
          return updated;
        },
        { replace: true }
      );
    });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access can be blocked; the address bar still has the link
    }
  }

  function shift(index: number, direction: -1 | 1) {
    const next = [...team];
    [next[index], next[index + direction]] = [
      next[index + direction],
      next[index],
    ];
    update({ team: next });
  }

  return (
    <Page wide>
      <PageHeader
        title="Team planner"
        subtitle="Theorycraft a team for one game. The team lives in the link, so you can share or bookmark it."
      />

      <Panel className="mb-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-60 flex-1">
            <p className="mb-1.5 t-label text-pk-muted">Game</p>
            <SelectBox
              label="Game"
              value={game}
              onChange={(value) => void chooseGame(value)}
            >
              {games.map((name) => (
                <option key={name} value={name}>
                  {versionGroupLabel(name)}
                </option>
              ))}
            </SelectBox>
          </div>
          <p className="flex-[2_1_16rem] t-small text-pk-muted">
            Uses the rules of{' '}
            <strong className="text-pk-ink">Generation {generation}</strong>:{' '}
            {typesInGeneration(generation).length} types,{' '}
            {roster ? `${roster.size} Pokémon to choose from` : 'any Pokémon'},
            and the moves each can learn in this game.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copyLink}
              className={buttonClass('secondary', 'md')}
            >
              {copied ? (
                <CheckIcon className="size-5 text-green-600" />
              ) : (
                <LinkIcon className="size-5" />
              )}
              {copied ? 'Copied' : 'Copy link'}
            </button>
            <button
              type="button"
              disabled={!team.length}
              onClick={() => update({ team: [] })}
              className={buttonClass('secondary', 'md')}
            >
              Clear
            </button>
          </div>
        </div>
      </Panel>

      <div
        className={
          isPending ? 'opacity-60 transition-opacity' : 'transition-opacity'
        }
      >
        <Panel
          className="mb-4"
          title={`Your team (${team.length}/${MAX_TEAM})`}
          actions={
            team.length < MAX_TEAM && (
              <button
                type="button"
                onClick={() => setPicking(true)}
                className={buttonClass('primary', 'md')}
              >
                <PlusIcon className="size-5" />
                Add Pokémon
              </button>
            )
          }
        >
          {team.length ? (
            <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {team.map((member, index) => (
                <React.Suspense
                  key={member.name}
                  fallback={
                    <li className="h-72 animate-pulse rounded-xl bg-pk-line/50" />
                  }
                >
                  <MemberCard
                    member={member}
                    index={index}
                    count={team.length}
                    game={game}
                    generation={generation}
                    roster={roster}
                    onChange={(changed) =>
                      update({
                        team: team.map((m, i) => (i === index ? changed : m)),
                      })
                    }
                    onRemove={() =>
                      update({ team: team.filter((_, i) => i !== index) })
                    }
                    onShift={(direction) => shift(index, direction)}
                  />
                </React.Suspense>
              ))}
            </ul>
          ) : (
            <EmptyState title="Start with your first Pokémon">
              Add up to six, then give each up to four moves. You'll see how the
              team holds up defensively and what it can hit.
            </EmptyState>
          )}
        </Panel>

        {team.length > 0 && (
          <React.Suspense fallback={<Loading />}>
            <TeamAnalysis team={team} generation={generation} />
          </React.Suspense>
        )}
      </div>

      <PokemonPicker
        open={picking}
        onClose={() => setPicking(false)}
        roster={roster}
        taken={team.map((m) => m.name)}
        onPick={(name) => {
          update({ team: [...team, { name, moves: [] }] });
          setPicking(false);
        }}
      />
    </Page>
  );
}
