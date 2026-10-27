import React from 'react';
import { BrowserRouter as Router } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PokedexContext } from './Utils/PokedexContext';
import type { NamedAPIResource } from './types/pokeapi';

const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
  const [currentRegion, setCurrentRegion] = React.useState<NamedAPIResource>({
    name: 'kanto',
    url: 'https://pokeapi.co/api/v2/region/1/',
  });

  const [currentPokedex, setCurrentPokedex] = React.useState<NamedAPIResource>({
    name: 'kanto',
    url: 'https://pokeapi.co/api/v2/pokedex/2/',
  });

  return (
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
  );
}

export default Providers;
