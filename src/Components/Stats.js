import React from 'react';
import Type from './Type';

function Stats({ currentPokemon }) {
  const { types, base_experience: baseXP, height, weight } = currentPokemon;
  return (
    <div className="w-full lg:mb-5 lg:max-w-[40%]">
      <div className=" mx-5 mt-5 w-auto rounded-md bg-gray-50 p-4 text-black shadow-lg lg:mr-0 lg:ml-5">
        <div className="mb-6 flex justify-center">
          <h5 className="text-2xl font-bold leading-none">Stats</h5>
        </div>
        <ul>
          <li className="h-25 py-2 sm:py-3">
            <div className="flex">
              <div className="text-md inline-flex w-[60%] font-semibold text-black">
                Types
              </div>
              <div className="inline-flex w-[40%]">
                <div className="mr-0 ml-auto">
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
                Base Experience
              </div>
              <div className="mr-0 ml-auto inline-flex text-right">
                <p className="text-lg font-bold">{baseXP} EXP</p>
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
                  {height * 10}cm <br /> {height / 10}m
                </p>
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
      </div>
    </div>
  );
}

export default Stats;
