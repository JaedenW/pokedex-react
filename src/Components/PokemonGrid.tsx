import React from 'react';
import { usePokedex } from '../Utils/PokedexContext';
import ProgressIndicator from './ProgressIndicator';
import useThisPokedex from '../Hooks/useThisPokedex';
import PokemonCard from './PokemonCard';
import type { NamedAPIResource } from '../types/pokeapi';

interface PokemonGridProps {
  search?: string;
  filterArray?: string[];
  reachedBottom: boolean;
  setReachedBottom: (reachedBottom: boolean) => void;
}

function PokemonGrid({
  search,
  filterArray,
  reachedBottom,
  setReachedBottom,
}: PokemonGridProps) {
  const [limit, setLimit] = React.useState(20);
  const { currentPokedex } = usePokedex();
  const [isPending, startTransition] = React.useTransition();
  const [toRender, setToRender] = React.useState<NamedAPIResource[]>([]);
  const { data: pokedexData } = useThisPokedex(currentPokedex.url);

  const pokedexSpecies = pokedexData.pokemon_entries.map(
    (entry) => entry.pokemon_species
  );

  React.useEffect(() => {
    startTransition(() => setLimit(20));
  }, [search, currentPokedex]);

  React.useEffect(() => {
    startTransition(() => {
      setToRender(() => {
        if (search) {
          return pokedexSpecies.filter((species) =>
            species.name.includes(search.toLowerCase())
          );
        } else if (filterArray) {
          return pokedexSpecies.filter((species) =>
            filterArray.includes(species.name)
          );
        } else {
          return pokedexSpecies;
        }
      });
    });
  }, [search, currentPokedex, filterArray]);

  React.useEffect(() => {
    startTransition(() => {
      if (reachedBottom && limit <= pokedexSpecies.length) {
        setLimit((prevLimit) => prevLimit + 30);
      }
    });

    setReachedBottom(false);
  }, [reachedBottom]);

  return (
    <div className="container mx-auto mt-12 mb-32">
      {isPending && <ProgressIndicator />}
      <div className="flex flex-wrap place-content-center lg:px-5">
        {toRender.slice(0, limit).map((species) => (
          <PokemonCard species={species} key={species.name} />
        ))}
      </div>
    </div>
  );
}

export default PokemonGrid;
