import React from 'react';
import Type from './Type';
import { Link } from 'react-router-dom';
import useThisPokemon from '../Hooks/useThisPokemon';

const EvoCard = ({ pokemon, evoDetails, evoStage, getDisplayName }) => {
  const { name, url } = pokemon;
  const { data, isSuccess } = useThisPokemon(url);
  const displayName = getDisplayName(name);
  const pokemonData = { name, url, displayName, ...data };
  const { sprites, types } = pokemonData;
  const [wasClicked, setWasClicked] = React.useState(false);

  function renderEvoDetails() {
    return evoDetails.map((evo) => {
      return evo?.detailsArray.map((evoDetails) => {
        return (
          <div className="m-2 rounded-lg bg-gray-100 p-2 text-[#292929] shadow-inner md:m-1">
            <ul className="font text-sm">
              {Object.entries(evoDetails).map((evoMethod) => {
                const [condition, value] = evoMethod;
                return (
                  value && (
                    <li className="flex justify-between">
                      <p className="text-left font-bold">
                        {getDisplayName(condition, '_')}:
                      </p>
                      <p className="text-right">
                        {(value?.name && getDisplayName(value.name)) || value}
                      </p>
                    </li>
                  )
                );
              })}
            </ul>
          </div>
        );
      });
    });
  }

  return (
    isSuccess && (
      <div>
        <div
          className={`m-[0.5rem] h-fit w-fit rounded-lg bg-[#DFDFDF] p-2 shadow-inner transition-[max-height] duration-200 ease-linear ${
            wasClicked ? 'max-h-[50rem]' : 'max-h-[11rem]'
          }`}
        >
          <div className="w-[13rem] md:w-[10rem]">
            <Link to={`/pokemon/${name}`} state={{ pokemonData }}>
              <img
                className="hover:scale-110np mx-auto -mb-1 block w-[6rem] duration-150"
                src={sprites.front_default}
                alt={displayName}
              />
              <div className="text-center">
                <h1 className="mx-auto mb-1 text-xl font-bold text-black">
                  {displayName}
                </h1>
              </div>
            </Link>
            {evoStage > 1 && (
              <div className="mx-auto flex w-fit rotate-90 justify-center">
                <button
                  type="button"
                  className="justify-right group z-30 inline-flex h-full cursor-pointer items-center"
                  onClick={() => setWasClicked((prevState) => !prevState)}
                >
                  <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-none focus:bg-slate-600 group-hover:bg-white ">
                    <svg
                      className="h-5 w-5 text-black sm:h-6 sm:w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d={!wasClicked ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
                      ></path>
                    </svg>
                    <span className="hidden">Next</span>
                  </span>
                </button>
              </div>
            )}
          </div>
          {wasClicked && evoStage > 1 && (
            <div className={`w-full`}>
              {<h4 className="mt-1 font-bold">Details</h4>}
              {renderEvoDetails()}
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default EvoCard;
