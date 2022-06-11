import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useQuery } from 'react-query';
import { typeColours } from '../Utils/typeColours';
import { getDisplayName } from '../Utils/Functions';
import Type from '../Components/Type';
import useThisPokedex from '../Hooks/useThisPokedex';
import PokemonCard from '../Components/PokemonCard';
import { PokedexContext } from '../Utils/PokedexContext';

function TypePage() {
  const { currentPokedex, currentRegion, setWillScroll } =
    React.useContext(PokedexContext);
  const typePokemonRef = React.useRef();
  const location = useLocation();
  const { name, url } = location.state.type;
  const { data: pokedexData } = useThisPokedex(currentPokedex?.url);
  const { data, isSuccess } = useQuery(['type', url], () => fetchType(url));
  const pokedexSpecies = pokedexData?.pokemon_entries.map((entry) => {
    return {
      id: entry.entry_number,
      species: entry.pokemon_species,
    };
  });

  React.useEffect(
    () =>
      typePokemonRef.current.scrollIntoView({
        behavior: 'smooth',
      }),
    [currentPokedex]
  );

  React.useEffect(() => setWillScroll(true), [location]);

  async function fetchType(url) {
    const res = await fetch(url);
    return res.json();
  }

  function renderTypePokemon() {
    const pokemonList = [
      ...data.pokemon.map((pokemon) => pokemon.pokemon.name),
    ];

    return pokedexSpecies
      .filter((pokemon) => pokemonList.includes(pokemon.species.name))
      .map((pokemon) => (
        <PokemonCard pokemon={pokemon} key={`${pokemon.species.name}Type`} />
      ));
  }

  return (
    <div className="mt-14">
      <div
        className="container z-20 mx-auto w-[90%] rounded-t-2xl bg-white text-center shadow-md md:w-[80%] 2xl:w-[50%]"
        style={{ backgroundColor: typeColours[name] }}
      >
        <div className="h-[3.5rem] rounded-t-2xl shadow-inner" />
        <h1 className="bg-white py-6 text-center text-6xl font-bold text-stone-700 sm:py-10">
          {getDisplayName(name)}
        </h1>
        <div>
          <div>
            <div className="container mx-auto w-full content-center py-10 shadow-inner lg:px-5 xl:px-10">
              <div className="mx-auto flex w-[90%] flex-wrap justify-evenly rounded-xl bg-gray-50 p-3 shadow-lg md:w-[85%]">
                {isSuccess &&
                  Object.entries(data.damage_relations).map((relation) => {
                    const [relationName, relationData] = relation;
                    return (
                      relationData.length > 0 && (
                        <div className="flex-grid m-2 mb-1 w-full min-w-[15rem] rounded-xl bg-[#DFDFDF] p-2 text-lg font-bold shadow-inner md:w-fit md:p-3 xl:min-w-[25rem]">
                          <h2 className="text-stone-700">
                            {getDisplayName(relationName, '_')}
                          </h2>
                          <div
                            ref={typePokemonRef}
                            className="flex flex-wrap justify-center"
                          >
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
          </div>
        </div>
      </div>
      <div
        className="container z-20 mx-auto mb-12 w-full content-center rounded-2xl pb-5 sm:w-[90%] md:w-[80%]"
        style={{ backgroundColor: typeColours[name] }}
      >
        <div className="mx-auto mb-6 w-full border bg-white px-8 py-4 text-center text-stone-700 shadow-sm">
          <h2 className="text-3xl font-bold">
            {getDisplayName(name)} Type Pokemon
          </h2>
          <h3 className="text-md font-semibold">
            {`${getDisplayName(currentRegion.name)} Region - ${getDisplayName(
              currentPokedex.name
            )} Pokedex`}
          </h3>
        </div>
        <div className="flex flex-wrap place-content-center px-1 sm:px-5">
          {isSuccess && renderTypePokemon()}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default TypePage;
