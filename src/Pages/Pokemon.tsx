import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { usePokedex } from '../Utils/PokedexContext';
import type { PokemonLocationState } from '../types/app';

const Stats = React.lazy(() => import('../Components/Stats'));
const Evolutions = React.lazy(() => import('../Components/Evolutions'));
const Moves = React.lazy(() => import('../Components/Moves'));

function Pokemon({ scrollTop }: { scrollTop: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPending, startTransition] = React.useTransition();
  const { currentPokedex } = usePokedex();
  const { pokemonData, speciesData } = location.state as PokemonLocationState;
  const { name, displayName, sprites } = pokemonData;
  const id = speciesData.pokedex_numbers.find(
    (pokedexNumber) => pokedexNumber.pokedex.name === currentPokedex.name
  )?.entry_number;

  React.useEffect(() => {
    startTransition(() => {
      if (id === undefined) navigate('/');
    });
  }, [currentPokedex]);

  React.useEffect(() => scrollTop(), [pokemonData]);

  return (
    !isPending && (
      <div className="w-screen pt-14 text-stone-700 sm:-ml-20 lg:-ml-40">
        <div className="mx-auto flex w-[90%] flex-col rounded-2xl bg-white text-center shadow-md sm:w-[60%] 2xl:w-[50%]">
          <h2 className="rounded-t-2xl bg-[#FFCC00] p-2 text-2xl font-bold text-[#D5A100] shadow-inner">
            #{('000' + id).slice(-3)} {/* Zerofilled ID */}
          </h2>
          <div>
            <img
              className="mx-auto my-5 min-h-40 w-[60%] max-w-[20rem] min-w-40 md:pt-5 lg:pt-10"
              src={
                sprites.other?.['official-artwork']?.front_default ?? undefined
              }
              alt={displayName}
            />
          </div>
          <h1 className="text-4xl font-bold md:text-6xl">{displayName}</h1>
          <div className="mx-auto my-10 w-full rounded-b-xl bg-[#FFCC00] pt-5 pb-20 shadow-inner lg:px-5 xl:px-10">
            <div className="flex flex-wrap">
              <Stats pokemonData={pokemonData} key={`${name}Stats`} />
              <Evolutions speciesData={speciesData} key={`${name}Evolution`} />
            </div>
            <Moves pokemonData={pokemonData} key={`${name}Moves`} />
          </div>
        </div>
      </div>
    )
  );
}

export default Pokemon;
