import React from 'react';
import PokemonGrid from '../Components/PokemonGrid';

function Home({ search }) {
  return (
    <div>
      <PokemonGrid search={search} />
    </div>
  );
}

export default Home;
