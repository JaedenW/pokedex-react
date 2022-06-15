import React from 'react';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import { PokedexContext } from '../Utils/PokedexContext';

const Stats = React.lazy(() => import('../Components/Stats'));
const Evolutions = React.lazy(() => import('../Components/Evolutions'));
const Moves = React.lazy(() => import('../Components/Moves'));

function Pokemon({ scrollTop }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPending, startTransition] = React.useTransition();
  const { currentPokedex } = React.useContext(PokedexContext);
  const { pokemonData, speciesData } = location.state;
  const { name, displayName, sprites, id } = pokemonData;

  React.useEffect(() => {
    startTransition(
      () =>
        speciesData.pokedex_numbers.filter(
          (pokedexNumber) => pokedexNumber.pokedex.name === currentPokedex.name
        ).length === 0 && navigate('/')
    );
  }, [currentPokedex]);

  React.useEffect(() => scrollTop(), [pokemonData]);

  return (
    !isPending && (
      <div className="pt-14 text-stone-700 lg:-ml-[10rem]">
        <div className="container mx-auto w-[90%] rounded-2xl bg-white text-center shadow-md lg:w-[60%] 2xl:w-[50%]">
          <h2 className="rounded-t-2xl bg-[#FFCC00] p-2 text-center text-2xl font-bold text-[#D5A100] shadow-inner">
            #{('000' + id).slice(-3)} {/* Zerofilled ID */}
          </h2>
          <div className="container h-[15rem] w-full justify-center sm:h-[25rem]">
            <img
              className="my-5 mx-auto w-[60%] min-w-[10rem] max-w-[20rem] md:pt-5 lg:pt-10"
              src={sprites?.other['official-artwork']?.front_default}
              alt={displayName}
            />
          </div>
          <h1 className=" text-4xl font-bold md:text-6xl">{displayName}</h1>
          <div className="container my-10 mx-auto w-full content-center rounded-b-xl bg-[#FFCC00] py-5 shadow-inner lg:px-5 xl:px-10">
            <div className="flex flex-wrap">
              <Stats pokemonData={pokemonData} key={`${name}Stats`} />
              <Evolutions
                pokemonData={pokemonData}
                speciesData={speciesData}
                key={`${name}Evolution`}
              />
              <Moves pokemonData={pokemonData} key={`${name}Moves`} />
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    )
  );
}

export default Pokemon;
