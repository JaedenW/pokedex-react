import React from 'react';
import { Link } from 'react-router-dom';
import { getDisplayName } from '../Utils/Functions';
import useThisPokemon from '../Hooks/useThisPokemon';
import useThisSpecies from '../Hooks/useThisSpecies';
import Type from './Type';

const PokemonCard = ({ pokemon }) => {
  const {
    species: { name, displayName = getDisplayName(name), url },
    id,
  } = pokemon;
  const { data: speciesData } = useThisSpecies(url);
  const variety = speciesData.varieties.map(
    (variety) => variety.is_default && variety.pokemon
  )[0];
  const { data } = useThisPokemon(variety.url);
  const pokemonData = { name, url, displayName, ...data };
  const { sprites, types } = pokemonData;

  return (
    <Link to={`/pokemon/${name}`} state={{ pokemonData, speciesData }}>
      <div className="m-2 w-[10.5rem] overflow-hidden rounded-lg bg-gray-50 shadow-md transition sm:m-4 sm:w-[14rem] sm:hover:scale-105 sm:hover:shadow-lg">
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
            <div className="inline-flex px-0.5 pb-2 sm:px-1 sm:pb-3 sm:pt-1">
              <Type type={type.type} key={type.slot} />
            </div>
          ))}
        </div>
        <footer className="text-md bg-[#FFCC00] p-2 text-center font-bold text-[#D5A100] shadow-inner">
          #{('000' + id).slice(-3)} {/* Zerofilled ID */}
        </footer>
      </div>
    </Link>
  );
};

export default PokemonCard;
