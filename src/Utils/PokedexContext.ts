import React from 'react';
import type { NamedAPIResource } from '../types/pokeapi';

interface PokedexContextValue {
  currentRegion: NamedAPIResource;
  setCurrentRegion: (region: NamedAPIResource) => void;
  currentPokedex: NamedAPIResource;
  setCurrentPokedex: (pokedex: NamedAPIResource) => void;
}

export const PokedexContext = React.createContext<PokedexContextValue | null>(
  null
);

export function usePokedex() {
  const context = React.useContext(PokedexContext);
  if (!context) throw new Error('usePokedex must be used inside <Providers>');
  return context;
}
