import React from 'react';

import { PokedexContext } from '../PokedexContext';
import useAllPokedex from '../Hooks/useAllRegions';
import useThisRegion from '../Hooks/useThisRegion';

function PokedexSelector({ toggleSidebar, setToggleSidebar }) {
  const { currentRegion, setCurrentRegion, currentPokedex, setCurrentPokedex } =
    React.useContext(PokedexContext);

  const { data } = useAllPokedex();

  !currentRegion && setCurrentRegion(data.results[0]);

  React.useEffect(
    () => setCurrentPokedex(selectedRegion.pokedexes[0]),
    [currentRegion]
  );

  const { data: selectedRegion } = useThisRegion(currentRegion?.url);

  return (
    <>
      <div
        className={`absolute top-[4.5rem] flex ${
          toggleSidebar
            ? 'left-[7.5rem] w-fit rounded-full'
            : 'left-[0rem] w-fit rounded-2xl'
        } z-50 ml-5 bg-[#FFCC00]
     text-center shadow-md sm:hidden`}
      >
        <h3
          className={`my-auto inline-flex ${
            toggleSidebar ? 'p-0' : 'pl-4 pr-2'
          } font-bold transition-[left] sm:hidden`}
        >
          {toggleSidebar ? '' : 'SELECT REGION'}
        </h3>
        <button
          type="button"
          className="justify-right items-cactive group z-30 inline-flex h-full cursor-pointer"
          onClick={() => setToggleSidebar((prevState) => !prevState)}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full group-active:bg-white group-active:opacity-50">
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
                d={!toggleSidebar ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
              ></path>
            </svg>
          </span>
        </button>
      </div>
      <div
        className={`fixed h-full ${
          toggleSidebar ? 'w-[8rem]' : 'w-[0rem]'
        } -mt-6 overflow-y-scroll bg-[#FFCC00] pt-6 text-lg text-stone-700 shadow-2xl transition-[width] sm:relative sm:-mt-0 sm:w-[10rem] sm:shadow-none`}
      >
        <ul className="grid-col">
          {data.results.map((region) => {
            const regionName = region.name;
            const isActive = regionName === currentRegion?.name;
            return (
              <li>
                <button
                  className={`${
                    isActive ? 'active-tab' : ''
                  } py-auto h-[4rem] w-full border-l-8 border-transparent px-4 text-right text-lg font-bold text-stone-700 hover:border-l-0 hover:border-r-8 hover:border-[#FB1B1B] hover:bg-white hover:bg-opacity-70 hover:shadow-inner md:text-xl`}
                  onClick={() => setCurrentRegion(region)}
                >
                  {regionName.toUpperCase()}
                </button>
                {isActive && (
                  <ul>
                    {selectedRegion.pokedexes.map((pokedex) => {
                      const pokedexName = pokedex.name;
                      const isActive = pokedexName === currentPokedex?.name;
                      return (
                        <li className="h-[3.3rem]">
                          <button
                            className={`${
                              isActive ? 'active-pokedex' : ''
                            } py-auto h-full w-full border-r-8 border-transparent bg-white bg-opacity-50 px-4 text-right text-sm font-bold text-stone-700 hover:border-r-0 hover:border-l-8 hover:border-[#0A285F] hover:bg-white hover:bg-opacity-80 hover:shadow-inner`}
                            onClick={() => setCurrentPokedex(pokedex)}
                          >
                            {pokedexName.includes('-')
                              ? pokedexName
                                  .split('-')
                                  .filter((word) => word !== regionName && word)
                                  .join(' ')
                                  .toUpperCase()
                              : 'ORIGINAL'}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default PokedexSelector;
