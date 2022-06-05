import React from 'react';

function BaseStats({ stats, getDisplayName }) {
  return (
    <div className="rounded-md bg-gray-100 p-3">
      {stats.map((baseStat) => {
        const statName = baseStat.stat.name;
        return (
          <div className="text-md flex justify-between font-bold">
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
