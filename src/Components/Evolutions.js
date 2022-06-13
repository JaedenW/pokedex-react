import React from 'react';
import EvolutionChain from './EvolutionChain';

function Evolutions({ speciesData, getDisplayName }) {
  const { evolution_chain, is_legendary, is_mythical } = speciesData;

  return (
    <div className="mb-5 w-full md:max-w-[55%]">
      <div className=" mx-5 mt-5 w-auto rounded-md bg-gray-50 py-5 shadow-lg">
        <div className="mb-6 flex justify-center">
          <h5 className="text-2xl font-bold leading-none ">Evolution</h5>
        </div>
        <EvolutionChain
          url={evolution_chain?.url}
          isLegendary={is_legendary}
          isMythical={is_mythical}
          getDisplayName={getDisplayName}
        />
      </div>
    </div>
  );
}

export default Evolutions;
