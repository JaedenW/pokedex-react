import React from 'react';
import { PokedexContext } from '../Utils/PokedexContext';
import useAllRegions from '../Hooks/useAllRegions';
import Region from './Region';
import { getPokedexLabel } from '../Utils/Functions';

function RegionSelector({ toggleSidebar, setToggleSidebar }) {
  const { currentRegion, currentPokedex } = React.useContext(PokedexContext);
  const { data: allRegions } = useAllRegions();

  return (
    <div className="first-line container pointer-events-none fixed top-0 z-30 flex h-screen flex-row pt-16 text-stone-800 sm:w-40">
      <div
        className={`flex h-full flex-col ${
          toggleSidebar ? 'w-40' : 'w-0'
        }  pointer-events-auto z-40 bg-[#FFCC00] text-lg transition-[width] sm:w-40`}
      >
        <div className="justify-end overflow-y-scroll pb-40">
          {allRegions.results.map((region) => (
            <Region region={region} setToggleSidebar={setToggleSidebar} />
          ))}
        </div>
      </div>
      <div className="inline-flex grow flex-col">
        <div className="pointer-events-auto inline-flex h-12 bg-[#FFCC00] text-center shadow-md transition-[padding] sm:hidden">
          <button
            type="button"
            className="z-50 inline-flex h-full"
            onClick={() => setToggleSidebar((prevState) => !prevState)}
          >
            <span className="my-auto inline-flex h-10 w-10 items-center justify-center rounded-full sm:hover:bg-white sm:hover:opacity-50">
              <svg
                className={`${
                  toggleSidebar ? '-scale-x-100' : 'scale-x-100'
                } h-7 transition-transform duration-200 ease-linear`}
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
                />
              </svg>
            </span>
          </button>
          <div className="fixed flex h-12 w-full pt-0.5">
            <h3
              className={`${
                toggleSidebar ? 'ml-10' : 'mx-auto'
              } my-auto whitespace-nowrap font-bold`}
            >
              {currentRegion.name.toUpperCase()} REGION -{' '}
              {getPokedexLabel(currentPokedex.name, currentRegion.name)}
            </h3>
          </div>
        </div>
        <div
          className={`flex ${
            toggleSidebar ? 'grow' : 'h-0 w-0'
          } pointer-events-auto z-10`}
          onClick={(event) => setToggleSidebar(false)}
        />
      </div>
    </div>
  );
}

export default RegionSelector;
