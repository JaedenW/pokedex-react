import React from 'react';
import useSpeciesData from '../Hooks/useSpeciesData';
import EvolutionChain from './EvolutionChain';

function Evolutions({ currentPokemon, getDisplayName }) {
  const { data, isSuccess } = useSpeciesData(currentPokemon?.species?.url);

  return (
    <div className="mb-5 w-full lg:max-w-[60%]">
      <div className=" mx-5 mt-5 w-auto rounded-md bg-gray-50 p-4 text-gray-900 shadow-lg lg:mx-5">
        <div className="mb-2 flex items-center justify-between">
          <h5 className="text-2xl font-bold leading-none ">Evolution Chain</h5>
        </div>
        <EvolutionChain
          url={data?.evolution_chain?.url}
          getDisplayName={getDisplayName}
        />
      </div>
    </div>
  );
}

export default Evolutions;
