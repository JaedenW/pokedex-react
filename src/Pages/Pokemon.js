import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Stats from '../Components/Stats';
import Evolutions from '../Components/Evolutions';
import { getDisplayName } from '../Utils/Functions';
import { PokedexContext } from '../Utils/PokedexContext';

function Pokemon() {
  const location = useLocation();
  const { setWillScroll } = React.useContext(PokedexContext);
  const currentPokemon = location.state.pokemonData;
  const { name, displayName, sprites, id } = currentPokemon;

  React.useEffect(() => setWillScroll(true), [location]);

  return (
    <div className="pt-14 text-stone-700">
      <div className="container mx-auto w-[90%] rounded-2xl bg-white text-center shadow-md md:w-[80%] 2xl:w-[50%]">
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
            <Stats
              currentPokemon={currentPokemon}
              getDisplayName={getDisplayName}
              key={`${name}Stats`}
            />
            <Evolutions
              currentPokemon={currentPokemon}
              getDisplayName={getDisplayName}
              key={`${name}Evolution`}
            />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Pokemon;
