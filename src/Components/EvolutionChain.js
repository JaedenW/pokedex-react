import React from 'react';
import useEvolutionChain from '../Hooks/useEvolutionChain';
import usePokemonData from '../Hooks/usePokemonData';
import EvoCard from './EvoCard';

function EvolutionChain({ url, getDisplayName }) {
  const { data, isSuccess } = useEvolutionChain(url);
  const { allData } = usePokemonData(true);
  const evolutionChain = flattenEvoChain();

  function renderEvolutionChain() {
    return (
      isSuccess &&
      flattenEvoChain().map((evoDetails) =>
        allData?.results
          .filter((pokemon) => pokemon.name === evoDetails.species_name)
          .map((pokemon) => {
            return (
              <EvoCard
                pokemon={pokemon}
                getDisplayName={getDisplayName}
                evoDetails={evoDetails}
                key={`${pokemon.name}Evo`}
              />
            );
          })
      )
    );
  }

  function flattenEvoChain() {
    let evoChain = [];
    let evoData = data?.chain;

    while (evoData !== undefined && evoData.hasOwnProperty('evolves_to')) {
      let numberOfEvolutions = evoData.evolves_to.length;
      console.log(evoData)
      let evoDetails = evoData.evolution_details[0];

      evoChain.push({
        species_name: evoData.species.name,
        min_level: !evoDetails ? 'None' : evoDetails.min_level,
        trigger_name: !evoDetails ? null : evoDetails.trigger.name,
        item: !evoDetails ? null : evoDetails.item,
      });

      if (numberOfEvolutions > 1) {
        for (let i = 1; i < numberOfEvolutions; i++) {
          evoDetails = evoData.evolution_details[i];

          evoChain.push({
            species_name: evoData.evolves_to[i].species.name,
            min_level: !evoDetails ? 'None' : evoDetails.min_level,
            trigger_name: !evoDetails ? null : evoDetails.trigger.name,
            item: !evoDetails ? null : evoDetails.item,
          });
        }
      }

      evoData = evoData['evolves_to'][0];
    }

    return evoChain;
  }

  isSuccess && console.log(flattenEvoChain())

  return (
    <div>
      <div className="container mt-4 mb-0 content-center px-3">
        <div className="-mx-1 flex flex-wrap place-content-center sm:mx-0 lg:-mx-7">
          {isSuccess && renderEvolutionChain()}
        </div>
      </div>
    </div>
  );
}

export default EvolutionChain;
