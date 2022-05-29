import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Type from '../Components/Type';

function Pokemon() {
  const location = useLocation();
  const currentPokemon = location.state.pokemonData;
  const {
    displayName,
    sprites,
    types,
    base_experience: baseXP,
    height,
  } = currentPokemon;

  return (
    <div className="block text-center">
      <img
        className="m-auto inline-block h-auto w-[20%]"
        src={sprites.front_default}
        alt={displayName}
      />
      <img
        className="m-auto inline-block h-auto w-[20%]"
        src={sprites.back_default}
        alt={displayName}
      />
      <h1 className="text-xl font-medium">{displayName}</h1>
      {types.map((type) => (
        <Type type={type.type} key={type.slot} />
      ))}
      <h1 className="text-xl font-medium">Base XP: {baseXP}</h1>
      <h1 className="text-xl font-medium">Height: {height}</h1>
      <Outlet />
    </div>
  );
}

export default Pokemon;
