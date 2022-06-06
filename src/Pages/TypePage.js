import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useQuery } from 'react-query';
import { typeColours } from '../Components/Data/typeColours';
import getDisplayName from '../Components/Data/getDisplayName';
import PokemonCard from '../Components/PokemonCard';
import Type from '../Components/Type';
import usePokemonData from '../Hooks/usePokemonData';

function TypePage() {
  const location = useLocation();
  const { name, url } = location.state.type;
  const { allData } = usePokemonData(true);

  async function fetchType(url) {
    const res = await fetch(url);
    return res.json();
  }

  const { data, isSuccess } = useQuery(['type', url], () => fetchType(url));

  function renderTypePokemon() {
    const pokemonList = data.pokemon.map((pokemon) => pokemon.pokemon.name);
    if (allData) {
      return allData?.results
        .filter((pokemon) => pokemonList.includes(pokemon.name))
        .slice(0, 40)
        .map((pokemon) => (
          <PokemonCard pokemon={pokemon} key={`${pokemon.name}Searched`} />
        ));
    }
  }

  return (
    <div className="mt-20">
      <div className="container mx-auto w-[95%] rounded-2xl bg-white text-center shadow-md md:w-[80%] 2xl:w-[50%]">
        <div
          className="h-[3.5rem] rounded-t-2xl shadow-inner"
          style={{ backgroundColor: typeColours[name] }}
        />
        <h1 className="py-10 text-center text-6xl font-bold text-stone-700">
          {getDisplayName(name)}
        </h1>
        <div>
          <div style={{ backgroundColor: typeColours[name] }}>
            <div className="container mx-auto w-full content-center py-10 shadow-inner lg:px-5 xl:px-10">
              <div className="mx-auto flex w-[90%] flex-wrap justify-evenly rounded-xl bg-gray-50 p-3 shadow-lg md:w-[85%]">
                {isSuccess &&
                  Object.entries(data.damage_relations).map((relation) => {
                    const [relationName, relationData] = relation;
                    return (
                      relationData.length > 0 && (
                        <div className="flex-grid m-2 w-full min-w-[15rem] rounded-xl bg-[#DFDFDF] p-2 text-lg font-bold shadow-inner md:w-fit md:p-3 xl:min-w-[25rem]">
                          <h2 className="text-stone-700">
                            {getDisplayName(relationName, '_')}
                          </h2>
                          <div className="flex flex-wrap justify-center">
                            {relationData.map((entry) => {
                              return (
                                <div className="m-1 sm:m-2">
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
            <div className="container mx-auto mb-12 w-full content-center rounded-b-xl pb-5">
              <h2 className="mx-auto mb-6 w-fit max-w-[85%] rounded-xl border bg-white px-8 py-3 text-3xl font-bold text-stone-700 shadow-md">
                {getDisplayName(name)} Type Pokemon:
              </h2>
              <div className="-mx-0.5 flex flex-wrap place-content-center sm:mx-2">
                {isSuccess && renderTypePokemon()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default TypePage;
