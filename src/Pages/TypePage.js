import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useQuery } from 'react-query';
import { PokedexContext } from '../Utils/PokedexContext';
import { typeColours } from '../Utils/typeColours';
import { getDisplayName } from '../Utils/Functions';
import PokemonGrid from '../Components/PokemonGrid';
import Type from '../Components/Type';

function TypePage({ reachedBottom, setReachedBottom, scrollTop }) {
  const { currentPokedex, currentRegion } = React.useContext(PokedexContext);
  const mountRef = React.useRef(false);
  const gridRef = React.useRef();
  const typePokemonRef = React.useRef();
  const location = useLocation();
  const { name, url } = location.state.type;
  const { data } = useQuery(['type', url], () => fetchType(url));

  const typePokemonFilter = [
    ...data.pokemon.map((pokemon) => pokemon.pokemon.name),
  ];

  React.useEffect(() => {
    mountRef.current && gridRef
      ? setTimeout(() => {
          typePokemonRef.current.scrollIntoView({
            behavior: 'smooth',
          });
        }, 500)
      : setTimeout(() => (mountRef.current = true), 500);
  }, [currentPokedex]);

  React.useEffect(() => scrollTop(), [location.pathname]);

  async function fetchType(url) {
    const res = await fetch(url);
    return res.json();
  }

  return (
    <div className="mt-14 lg:-ml-[10rem]">
      <div
        className="container z-20 mx-auto w-[90%] rounded-t-2xl bg-white text-center shadow-md lg:w-[60%] 2xl:w-[50%]"
        style={{ backgroundColor: typeColours[name] }}
      >
        <div className="h-[3.5rem] rounded-t-2xl shadow-inner" />
        <h1 className="bg-white py-6 text-center text-6xl font-bold text-stone-700 sm:py-10">
          {getDisplayName(name)}
        </h1>
        <div>
          <div>
            <div className="flex-grid mx-auto flex w-full content-center py-10 shadow-inner lg:px-5">
              <div className=" mx-auto flex w-[90%] flex-col flex-wrap justify-evenly rounded-xl bg-gray-50 p-3 pt-4 shadow-lg md:w-[85%]">
                {Object.entries(data.damage_relations).map((relation) => {
                  const [relationName, relationData] = relation;
                  return (
                    relationData.length > 0 && (
                      <div className="mb-1 flex h-fit w-full flex-row rounded-xl bg-[#DFDFDF] text-sm md:text-lg font-bold shadow-inner ">
                        <div className="my-auto flex h-full w-[25%] justify-end border-4 rounded-l-xl border-stone-400 p-2 md:p-3">
                          <h2 className="text-right text-stone-700">
                            {getDisplayName(relationName, '_')}
                          </h2>
                        </div>
                        <div
                          ref={typePokemonRef}
                          className="my-auto mx-3 flex flex-grow flex-wrap justify-start"
                        >
                          {relationData.map((entry) => {
                            return (
                              <div className="m-1">
                                <Type type={entry} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="container z-20 mx-auto w-full content-center rounded-b-2xl pb-10 sm:w-[90%] lg:w-[60%] 2xl:w-[50%]"
        style={{ backgroundColor: typeColours[name] }}
      >
        <div className="mx-auto mb-6 w-full border bg-white px-8 py-8 text-center text-stone-700 shadow-sm">
          <h2 className="text-3xl font-bold">
            {getDisplayName(name)} Type Pokemon
          </h2>
          <h3 className="text-md font-semibold">
            {`${getDisplayName(currentRegion.name)} Region - ${getDisplayName(
              currentPokedex.name
            )} Pokedex`}
          </h3>
        </div>
        <div ref={gridRef}>
          <PokemonGrid
            filterArray={typePokemonFilter}
            reachedBottom={reachedBottom}
            setReachedBottom={setReachedBottom}
          />
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default TypePage;
