import React from 'react';
import Type from './Type';
import { Link } from 'react-router-dom';
import useThisPokemon from '../Hooks/useThisPokemon';

const PokemonCard = ({ pokemon, getDisplayName }) => {
  const { name, url } = pokemon;
  const { data, isSuccess } = useThisPokemon(url);
  const displayName = getDisplayName(name);
  const pokemonData = { name, url, displayName, ...data };
  const { sprites, types, id } = pokemonData;
  const [cardVisibility, setCardVisibility] = React.useState('hidden');

  return (
    id < 10000 &&
    isSuccess && (
      <Link
        to={`/pokemon/${name}`}
        state={{ pokemonData }}
        style={{ visibility: cardVisibility }}
      >
        <div className="m-4 w-[17rem] items-center overflow-hidden rounded-lg border-0 bg-gray-50 shadow-sm transition duration-100 hover:scale-105 hover:shadow-lg sm:w-[15rem]">
          <img
            onLoad={() => setCardVisibility('visible')}
            className="mx-auto my-1 block h-auto w-[80%] sm:w-[65%]"
            src={sprites.front_default}
            alt={displayName}
          />
          <div className="text-center">
            <h1 className="text m-3 my-1 text-xl font-bold text-black">
              {displayName}
            </h1>
            {types.map((type) => (
              <div className="inline-flex px-2 pb-4 pt-1">
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
