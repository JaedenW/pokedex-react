import React from 'react';
import useThisPokedex from '../Hooks/useThisPokedex';
import { usePokedex } from '../Utils/PokedexContext';
import Move from './Move';
import Spinner from '../Components/Spinner';
import { getDisplayName } from '../Utils/Functions';
import type { NamedAPIResource } from '../types/pokeapi';
import type { PokemonData } from '../types/app';

function Moves({ pokemonData }: { pokemonData: PokemonData }) {
  const { currentPokedex } = usePokedex();
  const { data: pokedexData } = useThisPokedex(currentPokedex.url);
  const [activeGroup, setActiveGroup] = React.useState<NamedAPIResource>();

  React.useEffect(
    () => setActiveGroup(pokedexData.version_groups[0]),
    [currentPokedex]
  );

  const activeMoves = pokemonData.moves.flatMap((move) =>
    move.version_group_details
      .filter(
        (groupDetails) => groupDetails.version_group.name === activeGroup?.name
      )
      .map((activeGroupDetails) => ({ move: move.move, activeGroupDetails }))
  );

  return (
    <div className="relative px-5">
      <div className="mx-auto flex flex-col rounded-md bg-gray-50 p-5 shadow-2xl">
        <h1 className="mb-4 w-full text-2xl font-bold">MOVES</h1>
        <div className="w-full rounded-lg bg-stone-300 shadow-inner">
          <div className="overflow-auto rounded-t-lg px-2 pb-2 whitespace-nowrap">
            {pokedexData.version_groups.map((versionGroup) => (
              <button
                className={`rounded-b-lg ${
                  activeGroup?.name === versionGroup.name
                    ? 'bg-[#FFCC00] shadow-md'
                    : 'bg-stone-300'
                } mx-1 p-3 text-lg font-bold`}
                onClick={() => setActiveGroup(versionGroup)}
                key={versionGroup.name}
              >
                {getDisplayName(versionGroup.name).toUpperCase()}
              </button>
            ))}
          </div>
          <React.Suspense
            fallback={
              <div className="my-auto flex h-80">
                <Spinner />
              </div>
            }
          >
            <div className="flex w-full flex-wrap justify-center py-4 font-semibold">
              {activeMoves.length ? (
                activeMoves.map(({ move, activeGroupDetails }) => (
                  <Move
                    move={move}
                    moveDetails={activeGroupDetails}
                    key={`${move.name}-${activeGroupDetails.move_learn_method.name}-${activeGroupDetails.level_learned_at}`}
                  />
                ))
              ) : (
                <p className="py-8 text-stone-500">No move data available</p>
              )}
            </div>
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}

export default Moves;
