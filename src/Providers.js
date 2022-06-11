import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { PokedexContext } from './Utils/PokedexContext';

function Providers({ children }) {
  const [currentRegion, setCurrentRegion] = React.useState({
    name: 'kanto',
    url: 'https://pokeapi.co/api/v2/region/1/',
  });

  const [currentPokedex, setCurrentPokedex] = React.useState({
    name: 'kanto',
    url: 'https://pokeapi.co/api/v2/pokedex/2/',
  });

  const [willScroll, setWillScroll] = React.useState(false);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  });

  return (
    <>
      <PokedexContext.Provider
        value={{
          currentRegion,
          setCurrentRegion,
          currentPokedex,
          setCurrentPokedex,
          willScroll,
          setWillScroll,
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
