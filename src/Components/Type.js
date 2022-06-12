import React from 'react';
import { Link } from 'react-router-dom';
import { typeColours } from '../Utils/typeColours';
import { getDisplayName } from '../Utils/Functions';

const Type = ({ type }) => {
  const { name } = type;

  return (
    <Link to={`/type/${name}`} state={{ type }}>
      <button
        className="hover:shadow-xs rounded-md px-2 py-1 text-center text-sm font-bold text-white shadow-sm hover:shadow-gray-600 sm:py-1.5 lg:text-lg"
        style={{ backgroundColor: typeColours[name] }}
      >
        {getDisplayName(name)}
      </button>
    </Link>
  );
};

export default Type;
