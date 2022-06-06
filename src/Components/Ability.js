import React from 'react';
import { useQuery } from 'react-query';

function Ability({ ability: { ability, is_hidden }, getDisplayName }) {
  const { name, url } = ability;

  async function fetchAbility(url) {
    const res = await fetch(url);
    return res.json();
  }

  const { data, isSuccess } = useQuery(['abilities', url], () =>
    fetchAbility(url)
  );

  return (
    <div className="text-md mt-3 flex-col justify-between rounded-md bg-gray-100 p-3 font-semibold shadow-inner">
      <p className="mb-2">{`${getDisplayName(name)} ${
        is_hidden ? ' (Hidden)' : ''
      }`}</p>
      {isSuccess &&
        data?.effect_entries.map((entry) => {
          return (
            entry.language.name === 'en' && (
              <p className="text-sm font-normal">
                {entry.short_effect || entry.effect}
              </p>
            )
          );
        })}
    </div>
  );
}

export default Ability;
