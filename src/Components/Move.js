import React from 'react';
import useThisMove from '../Hooks/useThisMove';
import Type from './Type';
import { typeColours } from '../Utils/typeColours';
import { getDisplayName } from '../Utils/Functions';

function Move({ move, moveDetails }) {
  const [wasClicked, setWasClicked] = React.useState(false);
  const { data: moveData } = useThisMove(move?.url);

  return (
    <div
      className={`${
        wasClicked ||
        'sm:hover:scale-105 sm:hover:cursor-pointer sm:hover:shadow-lg'
      } m-2 h-fit w-[90%] rounded-md p-2 shadow-md transition sm:w-[45%] xl:w-[30%]`}
      style={{ backgroundColor: typeColours[moveData.type.name] }}
      onClick={() => setWasClicked((prevState) => !prevState)}
    >
      <h3 className="mb-1 whitespace-nowrap text-lg text-gray-100">
        {getDisplayName(move.name).toUpperCase()}
      </h3>
      <div
        className={`${
          wasClicked ? 'visible' : 'hidden'
        } rounded-md bg-gray-100 p-2 sm:text-sm`}
      >
        <div className="my-2 flex justify-between">
          <p className="inline-flex max-w-[60%] text-left">Type:</p>
          <div>
            <Type type={moveData.type} />
          </div>
        </div>
        {moveDetails.level_learned_at > 0 ? (
          <div className="flex justify-between">
            <p className="inline-flex max-w-[55%] text-left">Learned at:</p>
            <p className="inline text-right font-normal">
              Level {moveDetails.level_learned_at}
            </p>
          </div>
        ) : (
          <div className="flex justify-between">
            <p className="inline-flex max-w-[60%] text-left">Learned via:</p>
            <p className="inline text-right font-normal">TM or HM</p>
          </div>
        )}
        <div className="flex justify-between">
          <p className="inline-flex max-w-[60%] text-left">PP:</p>
          <p className="inline-flex text-right font-normal">{moveData.pp}</p>
        </div>
        <div className="flex justify-between">
          <p className="inline-flex max-w-[60%] text-left">Target:</p>
          <p className="inline-flex max-w-[40%] text-right font-normal">
            {getDisplayName(moveData.target.name)}
          </p>
        </div>
        {moveData.power && (
          <div className="flex justify-between">
            <p className="inline-flex max-w-[60%] text-left">Power:</p>
            <p className="inline-flex text-right font-normal">
              {moveData.power}
            </p>
          </div>
        )}
        {Object.entries(moveData?.meta).map(
          (moveMeta) =>
            moveMeta[1] && (
              <div className="flex justify-between">
                <p className="inline-flex max-w-[60%] text-left">
                  {getDisplayName(moveMeta[0], '_')}:
                </p>
                <p className="inline-flex max-w-[40%] text-right font-normal">
                  {(moveMeta[1]?.name &&
                    getDisplayName(moveMeta[1]?.name, '+')) ||
                    moveMeta[1]}
                </p>
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default Move;
