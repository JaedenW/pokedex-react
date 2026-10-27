import type { QueryClient } from '@tanstack/react-query';
import { apiQuery, pathFromUrl } from '../api/pokeapi';
import { getDefaultVariety } from './species';
import type { Pokemon, PokemonSpecies } from '../types/pokeapi';

// Loads what a PokemonCard needs into the query cache ahead of time
export async function prefetchPokemonCard(
  queryClient: QueryClient,
  speciesUrl: string
) {
  try {
    const species = await queryClient.ensureQueryData(
      apiQuery<PokemonSpecies>(pathFromUrl(speciesUrl))
    );
    await queryClient.prefetchQuery(
      apiQuery<Pokemon>(pathFromUrl(getDefaultVariety(species).pokemon.url))
    );
  } catch {
    // best effort: the card fetches for itself if this fails
  }
}
