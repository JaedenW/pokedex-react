import React from 'react';
import useThisPokedex from '../Hooks/useThisPokedex';
import { PokedexContext } from '../Utils/PokedexContext';
import Move from './Move';
import Spinner from '../Components/Spinner';
import { getDisplayName } from '../Utils/Functions';

function Moves({ pokemonData }) {
  const { currentPokedex } = React.useContext(PokedexContext);
  const { data: pokedexData } = useThisPokedex(currentPokedex.url);
  const [activeGroup, setActiveGroup] = React.useState();

  React.useEffect(
    () => setActiveGroup(pokedexData.version_groups[0]),
    [currentPokedex]
  );

  return (
    <div className="relative px-5">
      <div className="mx-auto flex flex-col rounded-md bg-gray-50 p-5 shadow-2xl">
        <h1 className="mb-4 w-full text-2xl font-bold">MOVES</h1>
        <div className="w-full rounded-lg bg-stone-300 shadow-inner">
          <div className="overflow-auto whitespace-nowrap rounded-t-lg px-2">
            {pokedexData.version_groups.map((versionGroup) => {
              const groupName = versionGroup.name;
              return (
                <button
                  className={`rounded-b-lg ${
                    activeGroup?.name === groupName
                      ? 'bg-[#FFCC00] shadow-md'
                      : 'bg-stone-300'
                  } mx-1 p-3 text-lg font-bold`}
                  onClick={() => setActiveGroup(versionGroup)}
                >
                  {getDisplayName(versionGroup.name).toUpperCase()}
                </button>
              );
            })}
          </div>
          <React.Suspense
            fallback={
              <div className="my-auto flex h-[20rem]">
                <Spinner />
              </div>
            }
          >
            <div className="flex w-full flex-wrap justify-center rounded-lg  py-4 font-semibold">
              {pokemonData.moves.map((move) =>
                move.version_group_details
                  .filter(
                    (groupDetails) =>
                      groupDetails.version_group.name === activeGroup?.name
                  )
                  .map((activeGroupDetails) => (
                    <Move
                      move={move.move}
                      moveDetails={activeGroupDetails}
                      activeGroup={activeGroup}
                    />
                  ))
              )}
            </div>
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
export default Moves;
