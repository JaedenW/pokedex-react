import React from 'react';
import { useLocation } from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { usePokedex } from '../Utils/PokedexContext';
import { fetchJson } from '../Utils/fetchJson';
import { typeColours } from '../Utils/typeColours';
import { getDisplayName } from '../Utils/Functions';
import PokemonGrid from '../Components/PokemonGrid';
import Type from '../Components/Type';
import type { Type as TypeData } from '../types/pokeapi';
import type { TypeLocationState } from '../types/app';

function TypePage({ scrollTop }: { scrollTop: () => void }) {
  const { currentPokedex, currentRegion } = usePokedex();
  const mountRef = React.useRef(false);
  const typePokemonRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { name, url } = (location.state as TypeLocationState).type;
  const { data } = useSuspenseQuery({
    queryKey: ['type', url],
    queryFn: () => fetchJson<TypeData>(url),
  });

  const typePokemonFilter = React.useMemo(
    () => data.pokemon.map((pokemon) => pokemon.pokemon.name),
    [data]
  );

  React.useEffect(() => {
    mountRef.current
      ? setTimeout(() => {
          typePokemonRef.current?.scrollIntoView({
            behavior: 'smooth',
          });
        }, 500)
      : setTimeout(() => (mountRef.current = true), 500);
  }, [currentPokedex]);

  React.useEffect(() => scrollTop(), [location.pathname]);

  return (
    <div className="mt-14 lg:-ml-40">
      <div
        className="container mx-auto w-[90%] rounded-t-2xl text-center shadow-md lg:w-[60%] 2xl:w-[50%]"
        style={{ backgroundColor: typeColours[name] }}
      >
        <div className="h-14 rounded-t-2xl shadow-inner" />
        <h1 className="bg-white py-6 text-6xl font-bold text-stone-700 sm:py-10">
          {getDisplayName(name)}
        </h1>
        <div>
          <div>
            <div className="mx-auto flex w-full py-10 shadow-inner lg:px-5">
              <div className="mx-auto flex w-[90%] flex-col rounded-xl bg-gray-50 p-3 pt-4 shadow-lg md:w-[85%] xl:w-[60%]">
                <h2 className="-mt-1 mb-3 w-full text-lg font-bold text-stone-700 md:text-xl">
                  Battle Interactions
                </h2>
                {Object.entries(data.damage_relations)
                  .filter(([, relationData]) => relationData.length > 0)
                  .map(([relationName, relationData]) => (
                    <div
                      className="mb-1 flex h-20 w-full rounded-xl bg-[#DFDFDF] font-bold shadow-inner md:h-24"
                      key={relationName}
                    >
                      <div
                        className="my-auto flex h-full max-w-[25%] min-w-[25%] grow flex-col justify-center rounded-l-xl border-2 p-2 text-sm md:p-3 md:text-base lg:border-4 xl:text-xl"
                        style={{ borderColor: typeColours[name] }}
                      >
                        <h2 className="text-right text-stone-700">
                          {getDisplayName(relationName, '_').toUpperCase()}
                        </h2>
                      </div>
                      <div
                        ref={typePokemonRef}
                        className="my-auto flex h-fit max-h-full flex-wrap overflow-auto p-1"
                      >
                        {relationData.map((entry) => (
                          <div className="m-0.5 sm:mx-1" key={entry.name}>
                            <Type type={entry} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="container mx-auto w-full rounded-b-2xl pb-10 sm:w-[90%] lg:w-[60%] 2xl:w-[50%]"
        style={{ backgroundColor: typeColours[name] }}
      >
        <div className="mx-auto mb-6 w-full border bg-white px-8 py-8 text-center text-stone-700 shadow-xs">
          <h2 className="text-3xl font-bold">
            {getDisplayName(name)} Type Pokemon
          </h2>
          <h3 className="font-semibold">
            {`${getDisplayName(currentRegion.name)} Region - ${getDisplayName(
              currentPokedex.name
            )} Pokedex`}
          </h3>
        </div>
        <PokemonGrid filterArray={typePokemonFilter} />
      </div>
    </div>
  );
}

export default TypePage;
