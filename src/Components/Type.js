import React from 'react';

const Type = (props) => {
  const { name } = props.type;

  function getDisplayName(name) {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  let colour = '';
  switch (name) {
    default:
      colour = '#1111FF';
      break;
    case 'normal':
      colour = '#A8A77A';
      break;
    case 'fire':
      colour = '#EE8130';
      break;
    case 'water':
      colour = '#6390F0';
      break;
    case 'electric':
      colour = '#F7D02C';
      break;
    case 'grass':
      colour = '#7AC74C';
      break;
    case 'ice':
      colour = '#96D9D6';
      break;
    case 'fighting':
      colour = '#C22E28';
      break;
    case 'poison':
      colour = '#A33EA1';
      break;
    case 'ground':
      colour = '#E2BF65';
      break;
    case 'flying':
      colour = '#A98FF3';
      break;
    case 'psychic':
      colour = '#F95587';
      break;
    case 'bug':
      colour = '#A6B91A';
      break;
    case 'rock':
      colour = '#B6A136';
      break;
    case 'ghost':
      colour = '#735797';
      break;
    case 'dragon':
      colour = '#6F35FC';
      break;
    case 'dark':
      colour = '#705746';
      break;
    case 'steel':
      colour = '#B7B7CE';
      break;
    case 'fairy':
      colour = '#D685AD';
      break;
  }

  return (
    <button
      className="pokefont text-md hover:shadow-xs inline-flex rounded-md px-5 py-2 text-center font-bold text-white shadow-sm hover:shadow-gray-600 sm:px-3"
      style={{ backgroundColor: colour }}
    >
      {getDisplayName(name)}
    </button>
  );
};

export default Type;
