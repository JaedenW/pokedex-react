import { usePokedex } from '../Utils/PokedexContext';
import useAllRegions from '../Hooks/useAllRegions';
import Region from './Region';
import { getPokedexLabel } from '../Utils/Functions';

interface RegionSelectorProps {
  toggleSidebar: boolean;
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

function RegionSelector({
  toggleSidebar,
  setToggleSidebar,
}: RegionSelectorProps) {
  const { currentRegion, currentPokedex } = usePokedex();
  const { data: allRegions } = useAllRegions();

  return (
    <div className="pointer-events-none fixed inset-y-0 z-30 container flex flex-row pt-16 text-stone-800 sm:w-40">
      <div
        className={`flex h-full flex-col ${
          toggleSidebar ? 'w-40' : 'w-0'
        } pointer-events-auto z-40 bg-[#FFCC00] text-lg transition-[width] sm:w-40`}
      >
        {/* On phones the list starts below the banner that overlaps the panel */}
        <div className="overflow-y-scroll overscroll-contain pt-12 pb-40 sm:pt-0">
          {allRegions.results.map((region) => (
            <Region
              region={region}
              setToggleSidebar={setToggleSidebar}
              key={region.name}
            />
          ))}
        </div>
      </div>
      <div className="pointer-events-auto fixed inset-x-0 top-16 z-50 flex h-12 items-center bg-[#FFCC00] shadow-md sm:hidden">
        <button
          type="button"
          className="inline-flex h-full items-center"
          onClick={() => setToggleSidebar((prevState) => !prevState)}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full sm:hover:bg-white sm:hover:opacity-50">
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
        {/* pr-10 balances the button so the title is centred on the banner */}
        <h3 className="mt-0.5 flex-1 pr-10 text-center font-bold whitespace-nowrap">
          {currentRegion.name.toUpperCase()} REGION -{' '}
          {getPokedexLabel(currentPokedex.name, currentRegion.name)}
        </h3>
      </div>
    </div>
  );
}

export default RegionSelector;
