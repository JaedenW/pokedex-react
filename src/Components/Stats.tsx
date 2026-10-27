import Type from './Type';
import Ability from './Ability';
import BaseStats from './BaseStats';
import type { PokemonData } from '../types/app';

function Stats({ pokemonData }: { pokemonData: PokemonData }) {
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
      <div className="mx-5 mt-5 rounded-md bg-gray-50 p-4 shadow-lg md:mr-0 md:ml-5">
        <ul className="-mt-2 text-xl">
          <li className="py-2 sm:py-3">
            <div className="flex">
              <div className="inline-flex w-[50%] font-semibold">Type</div>
              <div className="inline-flex w-[50%] justify-end">
                <div className="inline-flex">
                  {types.map((type) => (
                    <div className="ml-2" key={`${type.slot}Stats`}>
                      <Type type={type.type} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </li>
          <li className="py-2 sm:py-3">
            <div className="flex">
              <div className="inline-flex font-semibold">Experience</div>
              <div className="ml-auto inline-flex text-right">
                <p className="text-lg font-bold">{XP} EXP</p>
              </div>
            </div>
          </li>
          <li className="py-2 sm:py-3">
            <div className="flex">
              <div className="inline-flex font-semibold">Height</div>
              <div className="ml-auto inline-flex text-right">
                <p className="text-lg font-bold">{height / 10}m</p>
              </div>
            </div>
          </li>
          <li className="py-2 sm:py-3">
            <div className="flex">
              <div className="inline-flex font-semibold">Weight</div>
              <div className="ml-auto inline-flex text-right">
                <p className="text-lg font-bold">{weight / 10}kg</p>
              </div>
            </div>
          </li>
        </ul>
        <div>
          <div className="mt-4 rounded-lg bg-stone-300 p-4 text-[#292929] shadow-md">
            <h2 className="mb-3 text-xl font-bold">Base Stats</h2>
            <BaseStats stats={stats} />
          </div>
          <div className="mt-4 rounded-lg bg-stone-300 p-4 text-[#292929] shadow-md">
            <h2 className="mb-3 text-xl font-bold">Abilities</h2>
            {abilities.map((ability) => (
              <Ability ability={ability} key={ability.ability.name} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
