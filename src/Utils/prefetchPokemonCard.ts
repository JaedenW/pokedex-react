import type { QueryClient } from '@tanstack/react-query';
import { speciesQueryOptions } from '../Hooks/useThisSpecies';
import { pokemonQueryOptions } from '../Hooks/useThisPokemon';
import { getDefaultVariety } from './Functions';

// Loads what a PokemonCard needs into the query cache ahead of time
export async function prefetchPokemonCard(
  queryClient: QueryClient,
  speciesUrl: string
) {
  try {
    const species = await queryClient.ensureQueryData(
      speciesQueryOptions(speciesUrl)
    );
    await queryClient.prefetchQuery(
      pokemonQueryOptions(getDefaultVariety(species).pokemon.url)
    );
  } catch {
    // best effort: the card fetches for itself if this fails
  }
}
