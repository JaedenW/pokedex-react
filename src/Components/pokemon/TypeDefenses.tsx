import { useSuspenseQueries } from '@tanstack/react-query';
import { apiQuery } from '../../api/pokeapi';
import {
  defensiveMultipliers,
  formatMultiplier,
  groupByMultiplier,
} from '../../Utils/typeChart';
import { cn } from '../../Utils/cn';
import { relationsInGeneration, typesInGeneration } from '../../Utils/teamPlan';
import TypeBadge from '../TypeBadge';
import type { Type } from '../../types/pokeapi';

const GROUP_STYLE: Record<number, { label: string; tone: string }> = {
  4: { label: 'Very weak', tone: 'bg-red-100 text-red-900' },
  2: { label: 'Weak', tone: 'bg-orange-100 text-orange-900' },
  0.5: { label: 'Resists', tone: 'bg-green-100 text-green-900' },
  0.25: { label: 'Strongly resists', tone: 'bg-emerald-100 text-emerald-900' },
  0: { label: 'Immune', tone: 'bg-stone-200 text-stone-800' },
};

/** How each attacking type fares against a Pokémon of the given type(s). */
export default function TypeDefenses({
  types,
  generation,
}: {
  types: string[];
  /** Use the damage chart and the types that existed in this generation */
  generation?: number | null;
}) {
  const results = useSuspenseQueries({
    queries: types.map((type) => apiQuery<Type>(`type/${type}`)),
  });
  const multipliers = defensiveMultipliers(
    results.map((result) =>
      generation
        ? relationsInGeneration(result.data, generation)
        : result.data.damage_relations
    )
  );
  const existing: string[] | null = generation
    ? typesInGeneration(generation)
    : null;
  const groups = groupByMultiplier(multipliers)
    .map(
      ([multiplier, attackers]) =>
        [
          multiplier,
          existing
            ? attackers.filter((type) => existing.includes(type))
            : attackers,
        ] as const
    )
    .filter(([, attackers]) => attackers.length);

  if (!groups.length) {
    return (
      <p className="t-body text-pk-muted">
        No notable weaknesses or resistances.
      </p>
    );
  }

  return (
    <dl className="space-y-3">
      {groups.map(([multiplier, attackers]) => {
        const style = GROUP_STYLE[multiplier];
        return (
          <div
            key={multiplier}
            className="flex flex-wrap items-center gap-x-3 gap-y-2"
          >
            <dt
              className={cn(
                'flex w-full shrink-0 items-center justify-between rounded-lg px-3 py-1.5 t-small font-bold sm:w-48',
                style?.tone
              )}
            >
              {style?.label}
              <span>×{formatMultiplier(multiplier)}</span>
            </dt>
            <dd className="flex flex-1 flex-wrap gap-1.5">
              {attackers.map((type) => (
                <TypeBadge key={type} name={type} size="sm" />
              ))}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
