import React from 'react';
import Type from './Type';

function Stats({ currentPokemon }) {
  const { types, base_experience: baseXP, height } = currentPokemon;
  return (
    <div className="w-full lg:mb-5 lg:max-w-[40%]">
      <div className=" bg-gray-50 mx-5 mt-5 w-auto rounded-md p-4 text-black shadow-lg lg:mr-0 lg:ml-5">
        <div className="mb-2 flex items-center justify-between">
          <h5 className="text-2xl font-bold leading-none ">Stats</h5>
        </div>
        <ul>
          <li className="h-25 py-2 sm:py-3">
            <div className="flex items-center">
              <div className="text-md inline-flex w-[30%] font-semibold text-black">
                Types
              </div>
              <div className="inline-flex w-[70%]">
                <div className="mr-0 ml-auto">
                  {types.map((type) => (
                    <div className="inline-flex pl-2">
                      <Type type={type.type} key={`${type.slot}Stats`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </li>
          <li className="h-25 py-2 sm:py-3">
            <div className="flex items-center">
              <div className="text-md inline-flex font-semibold text-black">
                Base Experience
              </div>
              <div className="mr-0 ml-auto inline-flex text-right">
                <p className="text-lg font-bold">{baseXP} XP</p>
              </div>
            </div>
          </li>
          <li className="h-25 py-2 sm:py-3">
            <div className="flex">
              <div className="text-md inline-flex font-semibold text-black">
                Height
              </div>
              <div className="mr-0 ml-auto inline-flex text-right">
                <p className="text-lg font-bold">
                  {height * 10} cm <br /> {height / 10} m
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Stats;
