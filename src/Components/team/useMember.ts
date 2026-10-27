import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { apiUrl } from '../../api/pokeapi';
import { fetchJson } from '../../Utils/fetchJson';
import { getDefaultVariety } from '../../Utils/species';
import type { Pokemon, PokemonSpecies } from '../../types/pokeapi';

/** A team member's species and default form, loaded together. */
export const memberQuery = (name: string) =>
  queryOptions({
    queryKey: ['member', name],
    queryFn: async () => {
      const species = await fetchJson<PokemonSpecies>(
        apiUrl(`pokemon-species/${name}`)
      );
      const pokemon = await fetchJson<Pokemon>(
        apiUrl(`pokemon/${getDefaultVariety(species).pokemon.name}`)
      );
      return { species, pokemon };
    },
  });

export const useMember = (name: string) =>
  useSuspenseQuery(memberQuery(name)).data;
