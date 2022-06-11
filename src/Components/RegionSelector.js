import React from 'react';

import { PokedexContext } from '../PokedexContext';
import useAllRegions from '../Hooks/useAllRegions';
import useThisRegion from '../Hooks/useThisRegion';
import ScrollToTop from './ScrollToTop';
import Region from './Region';

function RegionSelector({ toggleSidebar, setToggleSidebar }) {
  const { currentRegion, setCurrentRegion, setCurrentPokedex } =
    React.useContext(PokedexContext);
  const { data: allRegions } = useAllRegions();

  !currentRegion && setCurrentRegion(allRegions?.results[0]);

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
          {allRegions.results.map((region) => (
            <Region region={region} />
          ))}
        </ul>
      </div>
    </>
  );
}

export default RegionSelector;
