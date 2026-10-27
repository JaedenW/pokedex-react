import React from 'react';
import { BrowserRouter as Router } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PokedexContext } from './Utils/PokedexContext';

// Queries use useSuspenseQuery, so no suspense default is needed here
const queryClient = new QueryClient();

function Providers({ children }) {
  const [currentRegion, setCurrentRegion] = React.useState({
    name: 'kanto',
    url: 'https://pokeapi.co/api/v2/region/1/',
  });

  const [currentPokedex, setCurrentPokedex] = React.useState({
    name: 'kanto',
    url: 'https://pokeapi.co/api/v2/pokedex/2/',
  });

  return (
    <>
      <PokedexContext.Provider
        value={{
          currentRegion,
          setCurrentRegion,
          currentPokedex,
          setCurrentPokedex,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Router>{children}</Router>
        </QueryClientProvider>
      </PokedexContext.Provider>
    </>
  );
}

export default Providers;
