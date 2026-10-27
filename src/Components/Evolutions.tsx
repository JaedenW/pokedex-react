import EvolutionChain from './EvolutionChain';
import type { PokemonSpecies } from '../types/pokeapi';

function Evolutions({ speciesData }: { speciesData: PokemonSpecies }) {
  return (
    <div className="mb-5 w-full md:max-w-[55%]">
      <div className="mx-5 mt-5 rounded-md bg-gray-50 py-5 shadow-lg">
        <div className="mb-6 flex justify-center">
          <h5 className="text-2xl leading-none font-bold">Evolution</h5>
        </div>
        <EvolutionChain speciesData={speciesData} />
      </div>
    </div>
  );
}

export default Evolutions;
