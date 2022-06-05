import React from 'react';
import Type from './Type';
import Ability from './Ability';
import BaseStats from './BaseStats';

function Stats({ currentPokemon, getDisplayName }) {
  const {
    types,
    base_experience: XP,
    height,
    weight,
    stats,
    abilities,
  } = currentPokemon;

  return (
    <div className="w-full md:mb-5 md:max-w-[45%]">
      <div className=" mx-5 mt-5 w-auto rounded-md bg-gray-50 p-4 text-black shadow-lg md:mr-0 md:ml-5">
        <ul className="-mt-2 text-xl">
          <li className="h-25 py-2 sm:py-3">
            <div className="flex">
              <div className="inline-flex w-[60%] font-semibold text-black">
                Type
              </div>
              <div className="inline-flex w-[40%]">
                <div className="mr-0 ml-auto text-lg md:text-sm">
                  {types.map((type) => (
                    <div className="flex justify-end pb-2">
                      <Type type={type.type} key={`${type.slot}Stats`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </li>
          <li className="h-25 py-2 sm:py-3">
            <div className="flex">
              <div className="text-md inline-flex font-semibold text-black">
                Experience
              </div>
              <div className="mr-0 ml-auto inline-flex text-right">
                <p className="text-lg font-bold">{XP} EXP</p>
              </div>
            </div>
          </li>
          <li className="h-25 py-2 sm:py-3">
            <div className="flex">
              <div className="text-md inline-flex font-semibold text-black">
                Height
              </div>
              <div className="mr-0 ml-auto inline-flex text-right">
                <p className="text-lg font-bold">{height / 10}m</p>
              </div>
            </div>
          </li>
          <li className="h-25 py-2 sm:py-3">
            <div className="flex">
              <div className="text-md inline-flex font-semibold text-black">
                Weight
              </div>
              <div className="mr-0 ml-auto inline-flex text-right">
                <p className="text-lg font-bold">{weight / 10}kg</p>
              </div>
            </div>
          </li>
        </ul>
        <div className="flex-grid">
          <div className="mt-4 rounded-lg bg-[#DFDFDF] p-4 text-[#292929] shadow-inner">
            <h2 className="mb-3 text-xl font-bold">Base Stats</h2>
            <BaseStats stats={stats} getDisplayName={getDisplayName} />
          </div>
          <div className="mt-4 rounded-lg bg-[#DFDFDF] p-4 text-[#292929] shadow-inner">
            <h2 className="mb-3 text-xl font-bold">Abilities</h2>
            {abilities.map((ability) => (
              <Ability ability={ability} getDisplayName={getDisplayName} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
