import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Stats from '../Components/Stats';
import Evolutions from '../Components/Evolutions';

function Pokemon({ search, getDisplayName }) {
  const [pageVisibility, setPageVisibility] = React.useState('hidden');
  const location = useLocation();
  const currentPokemon = location.state.pokemonData;
  const { name, displayName, sprites } = currentPokemon;

  return (
    <div className="mt-20" style={{ visibility: pageVisibility }}>
      <div className="mx-auto block w-[90%] rounded-2xl bg-white text-center shadow-md md:w-[80%] md:pt-5 lg:pt-10 2xl:w-[50%]">
        <div>
          <img
            className="m-auto inline-block h-auto w-[25%] min-w-[10rem] max-w-[15rem]"
            src={sprites.front_default}
            alt={displayName}
          />
          <img
            className="m-auto inline-block h-auto w-[25%] min-w-[10rem] max-w-[15rem]"
            src={sprites.back_default}
            alt={displayName}
            onLoad={() => setPageVisibility('visible')}
          />
        </div>
        <h1 className=" text-4xl font-bold text-black md:text-6xl">
          {displayName}
        </h1>
        <div className="container my-10 mx-auto w-full content-center rounded-b-xl bg-[#FFCC00] py-5 shadow-inner lg:px-5 xl:px-10">
          <div className="flex flex-wrap">
            <Stats currentPokemon={currentPokemon} key={`${name}Stats`} />
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
