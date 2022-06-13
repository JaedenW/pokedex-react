import React from 'react';
import { getDisplayName } from '../Utils/Functions';

function BaseStats({ stats }) {
  return (
    <div className="rounded-md bg-gray-100 p-3 shadow-inner">
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
