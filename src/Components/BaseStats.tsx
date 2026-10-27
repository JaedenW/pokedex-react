import { getDisplayName } from '../Utils/Functions';
import type { Pokemon } from '../types/pokeapi';

function BaseStats({ stats }: { stats: Pokemon['stats'] }) {
  return (
    <div className="rounded-md bg-gray-100 p-3 shadow-inner">
      {stats.map((baseStat) => {
        const statName = baseStat.stat.name;
        return (
          <div className="flex justify-between font-bold" key={statName}>
            <p className="text-left">
              {statName === 'hp' ? 'HP' : getDisplayName(statName)}:
            </p>
            <p className="text-right font-normal">{baseStat.base_stat}</p>
          </div>
        );
      })}
    </div>
  );
}

export default BaseStats;
