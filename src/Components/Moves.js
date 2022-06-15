import React from 'react';
import useThisPokedex from '../Hooks/useThisPokedex';
import { PokedexContext } from '../Utils/PokedexContext';
import Move from './Move';
import Spinner from '../Components/Spinner';

function Moves({ pokemonData }) {
  const { currentPokedex } = React.useContext(PokedexContext);
  const { data: pokedexData } = useThisPokedex(currentPokedex.url);
  const [activeGroup, setActiveGroup] = React.useState();

  React.useEffect(
    () => setActiveGroup(pokedexData.version_groups[0]),
    [currentPokedex]
  );

  return (
    <div className="flex w-full grow px-5">
      <div className="flex w-full flex-col rounded-md bg-gray-50 p-5 shadow-2xl">
        <h1 className="mb-4 w-full text-2xl font-bold">MOVES</h1>
        <div className="w-full rounded-lg bg-stone-300 shadow-inner">
          {pokedexData.version_groups.map((versionGroup) => {
            const groupName = versionGroup.name;
            return (
              <button
                className={`grow rounded-b-lg ${
                  activeGroup?.name === groupName
                    ? 'bg-[#FFCC00] shadow-md'
                    : 'bg-stone-300'
                } mx-1 p-3 text-lg font-bold`}
                onClick={() => setActiveGroup(versionGroup)}
              >
                {versionGroup.name.toUpperCase()}
              </button>
            );
          })}
          <React.Suspense
            fallback={
              <div className="h-[10rem] justify-center">
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
