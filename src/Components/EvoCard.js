import React from 'react';
import { Link } from 'react-router-dom';
import useThisPokemon from '../Hooks/useThisPokemon';
import useThisSpecies from '../Hooks/useThisSpecies';
import { getDisplayName } from '../Utils/Functions';

const EvoCard = ({ species, evoDetails, evoStage }) => {
  const { data: speciesData } = useThisSpecies(species.url);
  const variety = speciesData.varieties[0];
  const { name } = speciesData;
  const { data } = useThisPokemon(variety.pokemon.url);
  const displayName = getDisplayName(name);
  const pokemonData = { name, displayName, ...data };
  const { sprites } = pokemonData;
  const [wasClicked, setWasClicked] = React.useState(false);

  return (
    <div>
      <div
        className={`m-2 flex h-fit max-w-[13rem] rounded-lg bg-gray-100 p-3 shadow-inner transition-[max-height] duration-200 ease-linear ${
          wasClicked ? 'max-h-[50rem]' : 'max-h-[13rem]'
        }`}
      >
        <div className="w-[12rem] md:w-[10rem]">
          <Link to={`/pokemon/${name}`} state={{ pokemonData, speciesData }}>
            <div className="text-center">
              <img
                className="mx-auto -my-2 w-[70%]"
                src={sprites.front_default}
                alt={displayName}
              />
              <h1 className="mx-auto mb-4 text-xl font-bold">{displayName}</h1>
            </div>
          </Link>
          <div>
            {evoStage > 1 && (
              <div className="mx-auto -mt-3 flex w-fit rotate-90 justify-center">
                <button
                  type="button"
                  className="justify-right group z-30 inline-flex h-full cursor-pointer items-center"
                  onClick={() => setWasClicked((prevState) => !prevState)}
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full group-hover:bg-stone-700 group-hover:text-white">
                    <svg
                      className="h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={!wasClicked ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            )}
          </div>
          {wasClicked && (
            <div className={`w-full`}>
              {<h4 className="font-bold">Conditions</h4>}
              {evoDetails.map((evo) => {
                return evo.detailsArray?.map((evoMethods) => (
                  <div className="mt-2 rounded-lg bg-[#DFDFDF] p-2 shadow-inner md:p-3">
                    <ul className="divide-y-8 divide-[#DFDFDF] text-sm">
                      {Object.entries(evoMethods)
                        .reverse()
                        .map((evoMethod) => {
                          const [condition, value] = evoMethod;
                          return (
                            value && (
                              <li className="font flex justify-between font-mono">
                                <p className="inline-flex w-[70%] text-left font-bold">
                                  {condition === 'min_level'
                                    ? 'Level'
                                    : getDisplayName(condition, '_')}
                                  :
                                </p>
                                <p className="inline-flex flex-wrap text-right">
                                  {(value?.name &&
                                    getDisplayName(value.name)) ||
                                    value}
                                </p>
                              </li>
                            )
                          );
                        })}
                    </ul>
                  </div>
                ));
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvoCard;
