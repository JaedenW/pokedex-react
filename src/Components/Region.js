import React from 'react';
import { PokedexContext } from '../Utils/PokedexContext';
import useThisRegion from '../Hooks/useThisRegion';

function Region({ region, setToggleSidebar }) {
  const { currentRegion, setCurrentRegion, currentPokedex, setCurrentPokedex } =
    React.useContext(PokedexContext);
  const [isActive, setIsActive] = React.useState(false);
  const { data: regionData } = useThisRegion(region.url);
  const { name: regionName } = region;

  React.useEffect(
    () => setIsActive(regionName === currentRegion.name),
    [currentRegion]
  );

  return (
    <div>
      <button
        className={`${
          isActive && 'active-tab'
        } h-[4.1rem] w-full border-l-8 border-transparent px-4 text-right text-lg font-bold text-stone-700 sm:hover:border-l-0 sm:hover:border-r-8 sm:hover:border-[#FB1B1B] sm:hover:bg-white sm:hover:bg-opacity-70 sm:hover:shadow-inner md:text-xl`}
        onClick={() => {
          setCurrentRegion(region);
          setCurrentPokedex(regionData.pokedexes[0]);
          setToggleSidebar(false);
        }}
      >
        {regionName.toUpperCase()}
      </button>
      {isActive && (
        <div>
          {regionData?.pokedexes?.map((pokedex) => {
            const pokedexName = pokedex.name;
            const isActive = pokedexName === currentPokedex?.name;
            return (
              <div className="h-[3.4rem]">
                <button
                  className={`${
                    isActive && 'active-pokedex'
                  } py-auto h-full w-full border-r-8 border-transparent bg-white bg-opacity-50 pr-2 pl-14 text-right text-sm font-bold text-stone-700 sm:hover:border-r-0 sm:hover:border-l-8 sm:hover:border-[#0A285F] sm:hover:bg-white sm:hover:bg-opacity-80 sm:hover:shadow-inner`}
                  onClick={() => {
                    setCurrentPokedex(pokedex);
                    setToggleSidebar(false);
                  }}
                >
                  {pokedexName.includes('-')
                    ? pokedexName
                        .split('-')
                        .filter((word) => word !== regionName && word)
                        .join(' ')
                        .toUpperCase()
                    : 'ORIGINAL'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Region;
