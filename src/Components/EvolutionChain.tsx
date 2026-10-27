import { usePokedex } from '../Utils/PokedexContext';
import useEvolutionChain from '../Hooks/useEvolutionChain';
import useThisPokedex from '../Hooks/useThisPokedex';
import EvoCard from './EvoCard';
import type {
  ChainLink,
  EvolutionDetail,
  NamedAPIResource,
  PokemonSpecies,
} from '../types/pokeapi';

export interface EvoStageEntry {
  species: NamedAPIResource;
  detailsArray: EvolutionDetail[] | null;
}

const ROMAN_KEY = [
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
];

function romanise(number: number) {
  const numerals = String(number).split('');
  let roman = '';
  let i = 3;
  while (i--) roman = (ROMAN_KEY[+numerals.pop()! + i * 10] || '') + roman;
  return Array(+numerals.join('') + 1).join('M') + roman;
}

function flattenEvoChain(chain: ChainLink) {
  const evoChain: EvoStageEntry[][] = [];
  let evoData: ChainLink | undefined = chain;

  while (evoData) {
    const numberOfEvolutions = evoData.evolves_to.length;
    const evoDetails = evoData.evolution_details[0];
    let evoStage: EvoStageEntry[] = [];

    evoStage.push({
      species: evoData.species,
      detailsArray: !evoDetails ? null : [evoDetails],
    });

    if (numberOfEvolutions > 1) {
      evoChain.push(evoStage);
      evoStage = [];
      for (let i = 1; i < numberOfEvolutions; i++) {
        const evolution = evoData.evolves_to[i].evolution_details;
        evoStage.push({
          species: evoData.evolves_to[i].species,
          detailsArray: !evolution ? null : evolution,
        });
      }
    }

    evoChain.push(evoStage);
    evoData = evoData.evolves_to[0];
  }
  return evoChain;
}

function EvolutionChain({ speciesData }: { speciesData: PokemonSpecies }) {
  const { currentPokedex } = usePokedex();
  const {
    evolution_chain: { url },
    is_legendary,
    is_mythical,
  } = speciesData;
  const { data } = useEvolutionChain(url);
  const { data: pokedexData } = useThisPokedex(currentPokedex.url);
  const evoChain = flattenEvoChain(data.chain);

  return (
    <div>
      <div className="mt-4">
        <div>
          {evoChain.map((evoStage, i) => (
            <div
              className="m-2 inline-grid w-[90%] rounded-lg bg-stone-300 p-1 pb-3 shadow-md"
              key={i}
            >
              {is_legendary || is_mythical ? (
                <h3
                  className="mx-auto my-2 w-fit rounded-md border-2 bg-gray-100 px-4 py-2 text-xl font-bold shadow-md"
                  style={{
                    color: is_legendary ? '#ffd500' : '#855AC9',
                    borderColor: is_legendary ? '#ffd500' : '#855AC9',
                  }}
                >
                  {is_legendary ? 'Legendary' : 'Mythical'}
                </h3>
              ) : (
                <h3 className="my-2 text-xl font-semibold">
                  STAGE {romanise(i + 1)}
                </h3>
              )}
              <div className="-mx-1 flex flex-wrap place-content-center sm:mx-0">
                {evoStage.map((evoDetails) =>
                  pokedexData.pokemon_entries
                    .filter(
                      (entry) =>
                        entry.pokemon_species.name === evoDetails.species.name
                    )
                    .map((entry) => (
                      <EvoCard
                        species={entry.pokemon_species}
                        evoStage={i + 1}
                        evoDetails={[evoDetails]}
                        key={entry.pokemon_species.name}
                      />
                    ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EvolutionChain;
