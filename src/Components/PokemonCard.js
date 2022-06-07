import React from 'react';
import Type from './Type';
import { Link } from 'react-router-dom';
import { getDisplayName } from '../Utils/Functions';
import useThisPokemon from '../Hooks/useThisPokemon';

const PokemonCard = ({ pokemon }) => {
  const { name, url } = pokemon;
  const { data } = useThisPokemon(url);
  const displayName = getDisplayName(name);
  const pokemonData = { name, url, displayName, ...data };
  const { sprites, types, id } = pokemonData;

  return (
    id < 10000 && (
      <Link to={`/pokemon/${name}`} state={{ pokemonData }}>
        <div className="m-2 w-[10rem] overflow-hidden rounded-lg bg-gray-50 shadow-md transition duration-100 hover:scale-105 hover:shadow-lg sm:m-4 sm:w-[14rem]">
          <div className="container h-[7rem] sm:h-[8rem]">
            <img
              className="mx-auto my-5 block h-[90%]"
              src={sprites.front_default}
              alt={displayName}
            />
          </div>
          <div className="justify-end text-center">
            <h1 className="text mb-1 text-xl font-bold text-black">
              {displayName}
            </h1>
            {types.map((type) => (
              <div className="inline-flex px-1 pb-2 sm:pb-3 sm:pt-1">
                <Type type={type.type} key={type.slot} />
              </div>
            ))}
          </div>
          <footer className="text-md bg-[#FFCC00] p-2 text-center font-bold text-[#D5A100] shadow-inner">
            #{('000' + id).slice(-3)} {/* Zerofilled ID */}
          </footer>
        </div>
      </Link>
    )
  );
};

export default PokemonCard;
