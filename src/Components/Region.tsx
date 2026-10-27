import { useNavigate } from 'react-router';
import { usePokedex } from '../Utils/PokedexContext';
import useThisRegion from '../Hooks/useThisRegion';
import { getPokedexLabel } from '../Utils/Functions';
import type { NamedAPIResource } from '../types/pokeapi';

interface RegionProps {
  region: NamedAPIResource;
  setToggleSidebar: (toggleSidebar: boolean) => void;
}

function Region({ region, setToggleSidebar }: RegionProps) {
  const { currentRegion, setCurrentRegion, currentPokedex, setCurrentPokedex } =
    usePokedex();
  const navigate = useNavigate();
  const { data: regionData } = useThisRegion(region.url);
  const { name: regionName } = region;
  const isActive = regionName === currentRegion.name;

  // Skip regions the API lists without pokedex data yet (e.g. Orre)
  if (!regionData.pokedexes.length) return null;

  return (
    <div>
      <button
        className={`${
          isActive ? 'active-tab' : ''
        } h-[4.1rem] w-full border-l-8 border-transparent px-4 text-right text-lg font-bold text-stone-700 sm:hover:border-r-8 sm:hover:border-l-0 sm:hover:border-[#FB1B1B] sm:hover:bg-white/70 sm:hover:shadow-inner md:text-xl`}
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
          {regionData.pokedexes.map((pokedex) => (
            <div className="h-[3.3rem]" key={pokedex.name}>
              <button
                className={`${
                  pokedex.name === currentPokedex.name ? 'active-pokedex' : ''
                } h-full w-full border-r-8 border-transparent bg-white/50 pr-2 pl-14 text-right text-sm font-bold text-stone-700 sm:hover:border-r-0 sm:hover:border-l-8 sm:hover:border-[#0A285F] sm:hover:bg-white/80 sm:hover:shadow-inner`}
                onClick={() => {
                  setCurrentPokedex(pokedex);
                  setToggleSidebar(false);
                  navigate('/');
                }}
              >
                {getPokedexLabel(pokedex.name, regionName)}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Region;
