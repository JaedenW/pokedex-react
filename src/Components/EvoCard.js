import React from 'react';
import { Link } from 'react-router-dom';
import useThisPokemon from '../Hooks/useThisPokemon';

const EvoCard = ({ pokemon, evoDetails, evoStage, getDisplayName }) => {
  const { name, url } = pokemon;
  const { data, isSuccess } = useThisPokemon(url);
  const displayName = getDisplayName(name);
  const pokemonData = { name, url, displayName, ...data };
  const { sprites, id } = pokemonData;
  const [wasClicked, setWasClicked] = React.useState(false);

  function renderEvoDetails() {
    return evoDetails.map((evo) => {
      return evo.detailsArray?.map((evoDetails) => (
        <div className="my-2 rounded-lg bg-[#DFDFDF] p-2 shadow-inner md:p-3">
          <ul className="divide-y-8 divide-[#DFDFDF] text-sm">
            {Object.entries(evoDetails)
              .reverse()
              .map((evoMethod) => {
                const [condition, value] = evoMethod;
                return (
                  value && (
                    <li className="flex justify-between">
                      <p className="inline-flex w-[70%] text-left font-bold">
                        {getDisplayName(condition, '_')}:
                      </p>
                      <p className="inline-flex flex-wrap text-right">
                        {(value?.name && getDisplayName(value.name)) || value}
                      </p>
                    </li>
                  )
                );
              })}
          </ul>
        </div>
      ));
    });
  }

  return (
    isSuccess &&
    id < 10000 && (
      <div>
        <div
          className={`m-2 mb-0 flex h-fit max-w-[13rem] rounded-lg bg-gray-100 p-3 shadow-inner transition-[max-height] duration-200 ease-linear ${
            wasClicked ? 'max-h-[50rem]' : 'max-h-[12rem]'
          }`}
        >
          <div className="w-[12rem] md:w-[10rem]">
            <Link to={`/pokemon/${name}`} state={{ pokemonData }}>
              <div className="text-center">
                <img
                  className="mx-auto -my-2 w-[70%]"
                  src={sprites.front_default}
                  alt={displayName}
                />
                <h1 className="mx-auto mb-4 text-xl font-bold">
                  {displayName}
                </h1>
              </div>
            </Link>
            <div>
              {evoStage > 1 && (
                <div className="mx-auto mb-1 -mt-5 flex w-fit rotate-90 justify-center">
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
            {wasClicked && evoStage > 1 && (
              <div className={`w-full`}>
                {<h4 className="font-bold">Conditions</h4>}
                {renderEvoDetails()}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default EvoCard;
