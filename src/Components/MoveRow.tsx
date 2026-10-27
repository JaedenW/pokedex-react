import React from 'react';
import { Link } from 'react-router';
import { useMove } from '../api/pokeapi';
import { firstEnglish, getDisplayName } from '../Utils/text';
import { cn } from '../Utils/cn';
import TypeBadge from './TypeBadge';
import { ChevronRightIcon } from './Icons';
import { Pill } from './ui';

const CLASS_COLOURS: Record<string, string> = {
  physical: '#C22E28',
  special: '#6390F0',
  status: '#8d8d8d',
};

export function DamageClassPill({ name }: { name: string }) {
  return <Pill colour={CLASS_COLOURS[name]}>{getDisplayName(name)}</Pill>;
}

/** Fills in PokeAPI's "$effect_chance" placeholder. */
export const effectText = (text: string, chance: number | null) =>
  text.replace(/\$effect_chance/g, String(chance ?? ''));

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <span className="t-small text-pk-ink sm:w-14 sm:text-right">
      <span className="mr-1 t-label text-pk-muted sm:hidden">{label}</span>
      {value ?? '—'}
    </span>
  );
}

export function MoveRowSkeleton() {
  return <li className="h-[5.25rem] animate-pulse rounded-xl bg-pk-line/50" />;
}

/** One move with its type, class and numbers; tap to read what it does. */
export default function MoveRow({
  name,
  level,
}: {
  name: string;
  /** Shown first when the move is learned by level */
  level?: number | null;
}) {
  const move = useMove(name);
  const [open, setOpen] = React.useState(false);
  const effect = firstEnglish(move.effect_entries);

  return (
    <li className="rounded-xl border border-pk-line bg-white">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2.5 sm:px-4">
        {level !== undefined && (
          <span className="w-10 shrink-0 t-body font-bold text-pk-gold">
            {level || 'Evo'}
          </span>
        )}
        <Link
          to={`/move/${name}`}
          className="min-w-0 flex-1 t-body leading-tight font-bold text-pk-navy underline-offset-2 hover:underline"
        >
          {getDisplayName(name)}
        </Link>
        <TypeBadge name={move.type.name} size="sm" />
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Hide description' : 'Show description'}
          onClick={() => setOpen((value) => !value)}
          className="flex size-9 shrink-0 items-center justify-center rounded-full transition hover:bg-pk-yellow sm:order-last"
        >
          <ChevronRightIcon
            className={cn('size-5 transition-transform', open && 'rotate-90')}
          />
        </button>
        {/* phones: name and type on the first line, numbers on the second */}
        <span className="basis-full sm:hidden" />
        <DamageClassPill name={move.damage_class.name} />
        <Stat label="Pow" value={move.power} />
        <Stat label="Acc" value={move.accuracy} />
        <Stat label="PP" value={move.pp} />
      </div>
      {open && (
        <p className="border-t border-pk-line px-4 py-3 t-small text-pk-muted">
          {effect
            ? effectText(effect.short_effect, move.effect_chance)
            : 'No description available.'}
        </p>
      )}
    </li>
  );
}
