import React from 'react';
import { PokedexContext } from '../Utils/PokedexContext';
import useAllRegions from '../Hooks/useAllRegions';
import Region from './Region';

function RegionSelector({ toggleSidebar, setToggleSidebar }) {
  const { currentRegion, currentPokedex } = React.useContext(PokedexContext);
  const { data: allRegions } = useAllRegions();

  return (
    <div className="width-screen overfow-hidden">
      <div
        className={`fixed top-[4rem] flex ${
          toggleSidebar ? 'ml-[10rem] shadow-none' : 'ml-[0rem]'
        }
     z-30 h-[3rem] w-full bg-[#FFCC00] text-center shadow-md transition-[padding] sm:hidden`}
      >
        <button
          type="button"
          className="z-50 inline-flex h-full cursor-pointer"
          onClick={() => setToggleSidebar((prevState) => !prevState)}
        >
          <span className="my-auto inline-flex h-10 w-10 items-center justify-center rounded-full duration-200 active:bg-white active:opacity-50">
            <svg
              className={`${
                toggleSidebar ? '-scale-x-100' : 'scale-x-100'
              } h-7  transform-gpu transition-transform duration-200 ease-linear`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d={'M9 5l7 7-7 7'}
              ></path>
            </svg>
          </span>
        </button>
        <h3 className="my-auto p-2 font-bold sm:hidden">
          {currentRegion.name.toUpperCase()} REGION -{' '}
          {currentPokedex.name.includes('-')
            ? currentPokedex.name
                .split('-')
                .filter((word) => word !== currentRegion.name && word)
                .join(' ')
                .toUpperCase()
            : 'ORIGINAL'}{' '}
          POKEDEX
        </h3>
      </div>
      <div
        className={`fixed h-screen ${
          toggleSidebar ? 'w-[10rem]' : 'w-[0rem]'
        } z-40 mt-[4rem] overflow-y-scroll bg-[#FFCC00] pb-[8rem] text-lg text-stone-700 transition-[width] sm:relative sm:z-10 sm:w-[10rem]`}
      >
        <div className="grid-col">
          {allRegions.results.map((region) => (
            <Region region={region} setToggleSidebar={setToggleSidebar} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RegionSelector;
