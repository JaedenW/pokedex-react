import React from 'react';
import { PokedexContext } from '../Utils/PokedexContext';
import ProgressIndicator from './ProgressIndicator';
import useThisPokedex from '../Hooks/useThisPokedex';
import PokemonCard from './PokemonCard';

function PokemonGrid({ search, filterArray, reachedBottom, setReachedBottom }) {
  const [limit, setLimit] = React.useState();
  const { currentPokedex } = React.useContext(PokedexContext);
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
    startTransition(() => setLimit(20));
  }, [search, currentPokedex]);

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
  }, [search, currentPokedex, filterArray]);

  React.useEffect(() => {
    startTransition(
      () =>
        reachedBottom &&
        limit <= pokedexSpecies.length &&
        setLimit((prevLimit) => prevLimit + 30)
    );

    setReachedBottom(false);
  }, [reachedBottom]);

  return (
    <div className="container mx-auto mt-12 mb-32 w-full content-center">
      {isPending && <ProgressIndicator />}
      <div className="flex flex-wrap place-content-center lg:px-5">
        {toRender?.slice(0, limit).map((pokemon) => (
          <PokemonCard pokemon={pokemon} key={pokemon.species.name} />
        ))}
      </div>
    </div>
  );
}

export default PokemonGrid;
