import React from 'react';
import { PokedexContext } from '../Utils/PokedexContext';
import useEvolutionChain from '../Hooks/useEvolutionChain';
import useThisPokedex from '../Hooks/useThisPokedex';
import EvoCard from './EvoCard';

function EvolutionChain({ url, isLegendary, isMythical, getDisplayName }) {
  const { currentPokedex } = React.useContext(PokedexContext);
  const { data } = useEvolutionChain(url);
  const { data: pokedexData } = useThisPokedex(currentPokedex?.url);
  const pokedexSpecies = pokedexData?.pokemon_entries.map((entry) => {
    return {
      id: entry.entry_number,
      species: entry.pokemon_species,
    };
  });
  const evoChain = flattenEvoChain();

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
    return evoChain?.map((evoStage, i) => (
      <div className="m-2 inline-grid w-[90%] rounded-lg  bg-stone-300 p-1 pb-3 shadow-md">
        {isLegendary || isMythical ? (
          <h3
            className="my-2 mx-auto w-fit rounded-md border-2 bg-gray-100 py-2 px-4 text-xl font-bold shadow-md"
            style={{
              color: isLegendary ? '#ffd500' : '#855AC9',
              borderColor: isLegendary ? '#ffd500' : '#855AC9',
            }}
          >
            {isLegendary ? 'Legendary' : 'Mythical'}
          </h3>
        ) : (
          <h3 className="my-2 text-xl font-semibold">
            STAGE {romanise(i + 1)}
          </h3>
        )}
        <div className="-mx-1 flex flex-wrap place-content-center sm:mx-0">
          {evoStage.map((evoDetails) =>
            pokedexSpecies
              .filter(
                (species) => species.species.name === evoDetails.species.name
              )
              .map((species) => (
                <EvoCard
                  species={species}
                  evoStage={i + 1}
                  getDisplayName={getDisplayName}
                  evoDetails={[evoDetails]}
                  key={`${species.name}Evo`}
                />
              ))
          )}
        </div>
      </div>
    ));
  }

  function flattenEvoChain() {
    const evoChain = [];
    let evoData = data?.chain;

    while (evoData !== undefined && evoData.hasOwnProperty('evolves_to')) {
      const numberOfEvolutions = evoData.evolves_to.length;
      const evoDetails = evoData.evolution_details[0];
      let evoStage = [];

      evoStage.push({
        species: evoData.species,
        detailsArray: !evoDetails ? null : [evoDetails],
      });

      if (numberOfEvolutions > 1) {
        evoChain.push(evoStage);
        evoStage = [];
        for (let i = 1; i < numberOfEvolutions; i++) {
          const evolution = evoData.evolves_to[i].evolution_details;
          const thisEvo = {
            species: evoData.evolves_to[i].species,
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
        <div>{renderEvolutionChain()}</div>
      </div>
    </div>
  );
}

export default EvolutionChain;
