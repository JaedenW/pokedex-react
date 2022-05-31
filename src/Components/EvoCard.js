import React from 'react';
import Type from './Type';
import { Link } from 'react-router-dom';
import useThisPokemon from '../Hooks/useThisPokemon';

const EvoCard = ({ pokemon, evoDetails, getDisplayName }) => {
  const { name, url } = pokemon;
  const { data, isSuccess } = useThisPokemon(url);
  const displayName = getDisplayName(name);
  const pokemonData = { name, url, displayName, ...data };
  const { sprites } = pokemonData;
  const { item, min_level: minLevel, trigger_name: trigger } = evoDetails;

  return (
    isSuccess && (
      <Link to={`/pokemon/${name}`} state={{ pokemonData }}>
        <div className="m-[0.5rem] bg-gray-200 h-[13rem] w-[11rem] items-center overflow-hidden rounded-lg shadow-inner transition duration-100 hover:scale-105 hover:shadow-md">
          <img
            className="mx-auto my-0 block h-auto w-[80%] sm:w-[65%]"
            src={sprites.front_default}
            alt={displayName}
          />
          <div className="text-center">
            <h1 className="mx-auto my-1 text-xl font-bold text-black">
              {displayName}
            </h1>
          </div>
          <ul className="text-sm font-bold">
            <li>
              <p>Trigger: {trigger ? getDisplayName(trigger) : 'None'}</p>
            </li>
            <li>
              <p>Min Level: {minLevel}</p>
            </li>
          </ul>
        </div>
      </Link>
    )
  );
};

export default EvoCard;
