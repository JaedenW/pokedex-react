import React from 'react';
import useEvolutionChain from '../Hooks/useEvolutionChain';
import usePokemonData from '../Hooks/usePokemonData';
import EvoCard from './EvoCard';

function EvolutionChain({ url, getDisplayName }) {
  const { data, isSuccess } = useEvolutionChain(url);
  const { allData } = usePokemonData(true);

  function romanise(number) {
    if (typeof number !== 'number') return -1;
    var numerals = String(+number).split(''),
      key = [
        '',
        'C',
        'CC',
        'CCC',
        'CD',
        'D',
        'DC',
        'DCC',
        'DCCC',
        'CM',
        '',
        'X',
        'XX',
        'XXX',
        'XL',
        'L',
        'LX',
        'LXX',
        'LXXX',
        'XC',
        '',
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
      ],
      roman = '',
      i = 3;
    while (i--) roman = (key[+numerals.pop() + i * 10] || '') + roman;
    return Array(+numerals.join('') + 1).join('M') + roman;
  }

  function renderEvolutionChain() {
    return flattenEvoChain().map((evoStage, i) => (
      <div className="inline-grid w-fit px-4">
        <h3 className="m-2 text-lg font-bold">STAGE {romanise(i + 1)}</h3>
        <div className="-mx-1 flex flex-wrap place-content-center sm:mx-0">
          {evoStage.map((evoDetails) =>
            allData?.results
              .filter((pokemon) => pokemon.name === evoDetails.species_name)
              .map((pokemon) => (
                <EvoCard
                  pokemon={pokemon}
                  evoStage={i + 1}
                  getDisplayName={getDisplayName}
                  evoDetails={[evoDetails]}
                  key={`${pokemon.name}Evo`}
                />
              ))
          )}
        </div>
      </div>
    ));
  }

  function flattenEvoChain() {
    let evoChain = [];
    let evoData = data?.chain;

    while (evoData !== undefined && evoData.hasOwnProperty('evolves_to')) {
      let numberOfEvolutions = evoData.evolves_to.length;
      let evoDetails = evoData.evolution_details[0];
      let evoStage = [];

      evoStage.push({
        species_name: evoData.species.name,
        detailsArray: !evoDetails ? null : [evoDetails],
      });

      if (numberOfEvolutions > 1) {
        evoChain.push(evoStage);
        evoStage = [];
        for (let i = 1; i < numberOfEvolutions; i++) {
          const speciesName = evoData.evolves_to[i].species.name;
          const evolution = evoData.evolves_to[i].evolution_details;
          const thisEvo = {
            species_name: speciesName,
            detailsArray: !evolution ? null : evolution,
          };
          evoStage.push(thisEvo);
        }
      }

      evoChain.push(evoStage);
      evoData = evoData['evolves_to'][0];
    }

    return evoChain;
  }

  return (
    <div>
      <div className="container mt-4 mb-0 content-center">
        <div>{isSuccess && renderEvolutionChain()}</div>
      </div>
    </div>
  );
}

export default EvolutionChain;
