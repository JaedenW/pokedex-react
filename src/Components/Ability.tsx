import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchJson } from '../Utils/fetchJson';
import { getDisplayName } from '../Utils/Functions';
import type { Ability as AbilityData, Pokemon } from '../types/pokeapi';

function Ability({
  ability: { ability, is_hidden },
}: {
  ability: Pokemon['abilities'][number];
}) {
  const { name, url } = ability;
  const { data } = useSuspenseQuery({
    queryKey: ['abilities', url],
    queryFn: () => fetchJson<AbilityData>(url),
  });

  return (
    <div className="mt-3 flex-col justify-between rounded-md bg-gray-100 p-3 font-semibold shadow-inner">
      <p className="mb-2">{`${getDisplayName(name)} ${
        is_hidden ? ' (Hidden)' : ''
      }`}</p>
      {data.effect_entries
        .filter((entry) => entry.language.name === 'en')
        .map((entry) => (
          <p className="text-sm font-normal" key={entry.language.name}>
            {entry.short_effect || entry.effect}
          </p>
        ))}
    </div>
  );
}

export default Ability;
