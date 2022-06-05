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
      return evo?.detailsArray.map((evoDetails) => (
        <div className="mt-2 rounded-lg bg-gray-100 p-2 text-[#292929] shadow-inner md:mx-0">
          <ul className="font divide-y-8 divide-gray-100 text-sm">
            {Object.entries(evoDetails)
              .reverse()
              .map((evoMethod) => {
                const [condition, value] = evoMethod;
                return (
                  value && (
                    <li className="flex justify-between">
                      <p className="inline-flex w-[50%] text-left font-bold">
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
          className={`m-1 flex h-fit max-w-[13rem] rounded-lg bg-[#DFDFDF] p-2 shadow-inner transition-[max-height] duration-200 ease-linear ${
            wasClicked ? 'max-h-[50rem]' : 'max-h-[12rem]'
          }`}
        >
          <div className="w-[12rem] md:w-[10rem]">
            <Link to={`/pokemon/${name}`} state={{ pokemonData }}>
              <div className="text-center">
                <img
                  className="mx-auto -my-3 w-[70%]"
                  src={sprites.front_default}
                  alt={displayName}
                />
                <h1 className="mx-auto text-xl font-bold text-black">
                  {displayName}
                </h1>
              </div>
            </Link>
            <div>
              {evoStage > 1 && (
                <div className="mx-auto flex w-fit rotate-90 justify-center">
                  <button
                    type="button"
                    className="justify-right group z-30 inline-flex h-full cursor-pointer items-center"
                    onClick={() => setWasClicked((prevState) => !prevState)}
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-none focus:bg-slate-600 group-hover:bg-white ">
                      <svg
                        className="h-7 text-black"
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
