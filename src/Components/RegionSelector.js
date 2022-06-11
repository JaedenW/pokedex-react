import React from 'react';
import useAllRegions from '../Hooks/useAllRegions';
import Region from './Region';

function RegionSelector({ toggleSidebar, setToggleSidebar }) {
  const { data: allRegions } = useAllRegions();

  return (
    <>
      <div
        className={`absolute top-[4rem] flex ${
          toggleSidebar ? 'w-fit shadow-none' : 'w-fit'
        } z-30 -ml-1
     rounded-b-md bg-[#FFCC00] text-center shadow-md sm:hidden`}
      >
        <h3 className="my-auto inline-flex pl-5 pr-3 font-bold sm:hidden">
          SELECT REGION
        </h3>
        <button
          type="button"
          className="justify-right z-50 inline-flex h-full cursor-pointer"
          onClick={() => setToggleSidebar((prevState) => !prevState)}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center active:bg-white active:opacity-50">
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
          toggleSidebar ? 'w-[9rem]' : 'w-[0rem]'
        } z-40 mt-[4rem] h-screen overflow-y-scroll bg-[#FFCC00] text-lg text-stone-700 transition-[width] sm:relative sm:z-10 sm:w-[10rem]`}
      >
        <div className="grid-col">
          {allRegions.results.map((region) => (
            <Region region={region} setToggleSidebar={setToggleSidebar} />
          ))}
        </div>
      </div>
    </>
  );
}

export default RegionSelector;
