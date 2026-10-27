import { Link } from 'react-router';
import { typeColours } from '../Utils/typeColours';
import { getDisplayName } from '../Utils/Functions';
import type { NamedAPIResource } from '../types/pokeapi';

const Type = ({ type }: { type: NamedAPIResource }) => {
  const { name } = type;

  return (
    <Link to={`/type/${name}`} state={{ type }}>
      <button
        className="rounded-md px-2 py-1 text-center text-sm font-bold text-white shadow-xs hover:shadow-gray-600 sm:py-1.5 lg:text-lg"
        style={{ backgroundColor: typeColours[name] }}
      >
        {getDisplayName(name)}
      </button>
    </Link>
  );
};

export default Type;
