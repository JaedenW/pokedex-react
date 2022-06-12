/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import ProgressIndicator from './ProgressIndicator';
import { PokedexContext } from '../Utils/PokedexContext';
import useThisPokedex from '../Hooks/useThisPokedex';
import PokemonCard from './PokemonCard';

function PokemonGrid({ search, filterArray }) {
  const { currentPokedex, setWillScroll } = React.useContext(PokedexContext);
  const [isPending, startTransition] = React.useTransition();
  const [toRender, setToRender] = React.useState([]);
  const { data: pokedexData } = useThisPokedex(currentPokedex?.url);

  const pokedexSpecies = pokedexData?.pokemon_entries.map((entry) => {
    return {
      id: entry.entry_number,
      species: entry.pokemon_species,
    };
  });

  React.useEffect(() => {
    startTransition(() => {
      setToRender(() => {
        if (search?.length > 0) {
          return pokedexSpecies.filter((pokemon) =>
            pokemon.species.name?.includes(search.toLowerCase())
          );
        } else if (filterArray) {
          return pokedexSpecies.filter((pokemon) =>
            filterArray.includes(pokemon.species.name)
          );
        } else {
          return pokedexSpecies;
        }
      });
    });
  }, [search, pokedexData, filterArray]);

  React.useEffect(() => setWillScroll(true), [search, pokedexData]);

  return (
    <div className="container mx-auto mt-12 w-full content-center">
      {isPending && <ProgressIndicator />}
      <div className="flex flex-wrap place-content-center px-1 sm:px-0 lg:px-5">
        {toRender?.map((pokemon) => (
          <PokemonCard pokemon={pokemon} key={pokemon.species.name} />
        ))}
      </div>
    </div>
  );
}

export default PokemonGrid;
