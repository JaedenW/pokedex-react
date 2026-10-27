import { Link } from 'react-router';
import { getDefaultVariety, getDisplayName } from '../Utils/Functions';
import useThisPokemon from '../Hooks/useThisPokemon';
import useThisSpecies from '../Hooks/useThisSpecies';
import Type from './Type';
import { usePokedex } from '../Utils/PokedexContext';
import type { NamedAPIResource } from '../types/pokeapi';
import type { PokemonData } from '../types/app';

const PokemonCard = ({ species }: { species: NamedAPIResource }) => {
  const { currentPokedex } = usePokedex();
  const { name, url } = species;
  const displayName = getDisplayName(name);
  const { data: speciesData } = useThisSpecies(url);
  const id = speciesData.pokedex_numbers.find(
    (pokedex) => pokedex.pokedex.name === currentPokedex.name
  )?.entry_number;
  const { data } = useThisPokemon(getDefaultVariety(speciesData).pokemon.url);
  const pokemonData: PokemonData = { ...data, displayName };
  const { sprites, types } = pokemonData;

  return (
    <Link to={`/pokemon/${name}`} state={{ pokemonData, speciesData }}>
      <div className="m-2 w-42 overflow-hidden rounded-lg bg-gray-50 shadow-md transition sm:m-4 sm:w-56 sm:hover:scale-105 sm:hover:shadow-lg">
        <div className="h-28 sm:h-32">
          <img
            className="mx-auto my-5 block h-[90%]"
            src={sprites.front_default ?? undefined}
            alt={displayName}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="text-center">
          <h1 className="mb-1 text-xl font-bold text-black">{displayName}</h1>
          {types.map((type) => (
            <div
              className="inline-flex px-0.5 pb-2 sm:px-1 sm:pt-1 sm:pb-3"
              key={type.slot}
            >
              <Type type={type.type} />
            </div>
          ))}
        </div>
        <footer className="bg-[#FFCC00] p-2 text-center font-bold text-[#D5A100] shadow-inner">
          #{('000' + id).slice(-3)} {/* Zerofilled ID */}
        </footer>
      </div>
    </Link>
  );
};

export default PokemonCard;
