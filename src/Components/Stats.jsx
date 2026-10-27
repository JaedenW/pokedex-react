import React from 'react';
import Type from './Type';
import Ability from './Ability';
import BaseStats from './BaseStats';

function Stats({ pokemonData }) {
  const {
    types,
    base_experience: XP,
    height,
    weight,
    stats,
    abilities,
  } = pokemonData;

  return (
    <div className="w-full md:mb-5 md:max-w-[45%]">
      <div className=" mx-5 mt-5 w-auto rounded-md bg-gray-50 p-4 shadow-lg md:mr-0 md:ml-5">
        <ul className="-mt-2 text-xl">
          <li className="h-25 py-2 sm:py-3">
            <div className="flex">
              <div className="inline-flex w-[50%] font-semibold">Type</div>
              <div className="inline-flex w-[50%] justify-end">
                <div className="inline-flex">
                  {types.map((type) => (
                    <div className="ml-2">
                      <Type type={type.type} key={`${type.slot}Stats`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </li>
          <li className="h-25 py-2 sm:py-3">
            <div className="flex">
              <div className="text-md inline-flex font-semibold">
                Experience
              </div>
              <div className="mr-0 ml-auto inline-flex text-right">
                <p className="text-lg font-bold">{XP} EXP</p>
              </div>
            </div>
          </li>
          <li className="h-25 py-2 sm:py-3">
            <div className="flex">
              <div className="text-md inline-flex font-semibold">Height</div>
              <div className="mr-0 ml-auto inline-flex text-right">
                <p className="text-lg font-bold">{height / 10}m</p>
              </div>
            </div>
          </li>
          <li className="h-25 py-2 sm:py-3">
            <div className="flex">
              <div className="text-md inline-flex font-semibold">Weight</div>
              <div className="mr-0 ml-auto inline-flex text-right">
                <p className="text-lg font-bold">{weight / 10}kg</p>
              </div>
            </div>
          </li>
        </ul>
        <div className="flex-grid">
          <div className="mt-4 rounded-lg bg-stone-300 p-4 text-[#292929] shadow-md">
            <h2 className="mb-3 text-xl font-bold">Base Stats</h2>
            <BaseStats stats={stats} />
          </div>
          <div className="mt-4 rounded-lg bg-stone-300 p-4 text-[#292929] shadow-md">
            <h2 className="mb-3 text-xl font-bold">Abilities</h2>
            {abilities.map((ability) => (
              <Ability ability={ability} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
