import {
  STAT_COLOURS,
  STAT_LABELS,
  baseStatTotal,
  calcStat,
} from '../../Utils/stats';
import type { Pokemon } from '../../types/pokeapi';

// the highest base stat in the games is 255
const MAX_BASE = 255;

export default function StatBars({ pokemon }: { pokemon: Pokemon }) {
  const total = baseStatTotal(pokemon.stats);
  const evYield = pokemon.stats.filter((stat) => stat.effort > 0);

  return (
    <div>
      <div className="grid grid-cols-[6rem_2.75rem_1fr] items-center gap-x-3 gap-y-2.5 sm:grid-cols-[6.5rem_3rem_1fr_7.5rem]">
        {/* column headings only exist once there is room for the range column */}
        <span className="hidden sm:block" />
        <span className="hidden sm:block" />
        <span className="hidden sm:block" />
        <span className="hidden text-right t-label text-pk-muted sm:block">
          Lv.100 range
        </span>
        {pokemon.stats.map(({ base_stat, stat }) => {
          const isHp = stat.name === 'hp';
          const min = calcStat(base_stat, 100, { isHp, nature: 0.9 });
          const max = calcStat(base_stat, 100, { isHp, evs: 252, nature: 1.1 });
          return (
            <div key={stat.name} className="contents">
              <span className="t-small font-bold">
                {STAT_LABELS[stat.name] ?? stat.name}
              </span>
              <span className="text-right t-body">{base_stat}</span>
              <div className="h-3.5 overflow-hidden rounded-full bg-pk-line/60">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${Math.min(100, (base_stat / MAX_BASE) * 100)}%`,
                    backgroundColor: STAT_COLOURS[stat.name] ?? '#a8a29e',
                  }}
                />
              </div>
              <span className="hidden text-right t-small text-pk-muted sm:block">
                {min}–{max}
              </span>
            </div>
          );
        })}
        <span className="t-small font-bold">Total</span>
        <span className="text-right t-body font-bold">{total}</span>
        <span />
        <span className="hidden sm:block" />
      </div>
      {evYield.length > 0 && (
        <p className="mt-4 t-small text-pk-muted">
          <span className="font-bold text-pk-ink">EV yield:</span>{' '}
          {evYield
            .map(
              (stat) =>
                `+${stat.effort} ${STAT_LABELS[stat.stat.name] ?? stat.stat.name}`
            )
            .join(', ')}
        </p>
      )}
    </div>
  );
}
