import React from 'react';
import { Link } from 'react-router';
import { officialArtworkUrl } from '../../api/sprites';
import { pokemonHref } from '../../Utils/dex';
import { memberTypesInGeneration, MAX_MOVES } from '../../Utils/teamPlan';
import type { TeamMember } from '../../Utils/teamPlan';
import { getDisplayName } from '../../Utils/text';
import { BackIcon, ChevronRightIcon, CloseIcon, PlusIcon } from '../Icons';
import TypeBadge from '../TypeBadge';
import { MoveChip, MovePicker } from './TeamPickers';
import { useMember } from './useMember';

interface MemberCardProps {
  member: TeamMember;
  index: number;
  count: number;
  game: string;
  generation: number;
  /** Pokémon obtainable in the game, or null when the game has no Pokédex */
  roster: Set<string> | null;
  onChange: (member: TeamMember) => void;
  onRemove: () => void;
  onShift: (direction: -1 | 1) => void;
}

export default function MemberCard({
  member,
  index,
  count,
  game,
  generation,
  roster,
  onChange,
  onRemove,
  onShift,
}: MemberCardProps) {
  const { pokemon } = useMember(member.name);
  const [picking, setPicking] = React.useState(false);
  const types = memberTypesInGeneration(pokemon, generation);
  const available = !roster || roster.has(member.name);
  const name = getDisplayName(member.name);
  const control =
    'flex size-9 items-center justify-center rounded-full border border-pk-line bg-white transition hover:border-pk-navy disabled:opacity-30 disabled:hover:border-pk-line';

  return (
    <li className="min-w-0 ds-frame p-4">
      <div className="flex items-start gap-3">
        <img
          src={officialArtworkUrl(pokemon.id)}
          alt=""
          className="size-24 shrink-0 object-contain"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <Link
            to={pokemonHref(member.name, 'national')}
            className="block t-h3 leading-tight break-words underline-offset-2 hover:underline"
          >
            {name}
          </Link>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {types.map((type) => (
              <TypeBadge key={type} name={type} size="sm" linked={false} />
            ))}
          </div>
          {!available && (
            <p className="mt-1.5 t-small font-bold text-pk-red">
              Not in this game
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 grid gap-1.5">
        {member.moves.map((move) => (
          <React.Suspense
            key={move}
            fallback={
              <div className="h-12 animate-pulse rounded-xl bg-pk-line/50" />
            }
          >
            <MoveChip
              name={move}
              onRemove={() =>
                onChange({
                  ...member,
                  moves: member.moves.filter((m) => m !== move),
                })
              }
            />
          </React.Suspense>
        ))}
        {member.moves.length < MAX_MOVES && (
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-pk-line t-small font-bold text-pk-muted transition hover:border-pk-navy hover:text-pk-navy"
          >
            <PlusIcon className="size-4" />
            Add move ({member.moves.length}/{MAX_MOVES})
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-pk-line pt-3">
        <div className="flex gap-1.5">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onShift(-1)}
            aria-label={`Move ${name} earlier`}
            className={control}
          >
            <BackIcon className="size-4" />
          </button>
          <button
            type="button"
            disabled={index === count - 1}
            onClick={() => onShift(1)}
            aria-label={`Move ${name} later`}
            className={control}
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name} from the team`}
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 t-small font-bold text-pk-muted transition hover:bg-pk-red hover:text-white"
        >
          <CloseIcon className="size-4" />
          Remove
        </button>
      </div>

      <MovePicker
        open={picking}
        onClose={() => setPicking(false)}
        pokemon={pokemon}
        game={game}
        selected={member.moves}
        onPick={(move) => {
          onChange({ ...member, moves: [...member.moves, move] });
          setPicking(false);
        }}
      />
    </li>
  );
}
