// Image URLs from the PokeAPI sprites repository. Most are predictable from an
// id or name, so lists can show pictures without fetching each resource.
const SPRITES =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites';

export const TYPE_IDS: Record<string, number> = {
  normal: 1,
  fighting: 2,
  flying: 3,
  poison: 4,
  ground: 5,
  rock: 6,
  bug: 7,
  ghost: 8,
  steel: 9,
  fire: 10,
  water: 11,
  grass: 12,
  electric: 13,
  psychic: 14,
  ice: 15,
  dragon: 16,
  dark: 17,
  fairy: 18,
};

export const officialArtworkUrl = (id: number, shiny = false) =>
  `${SPRITES}/pokemon/other/official-artwork/${shiny ? 'shiny/' : ''}${id}.png`;

export const homeSpriteUrl = (id: number, shiny = false) =>
  `${SPRITES}/pokemon/other/home/${shiny ? 'shiny/' : ''}${id}.png`;

export const pokemonSpriteUrl = (id: number, shiny = false) =>
  `${SPRITES}/pokemon/${shiny ? 'shiny/' : ''}${id}.png`;

export const itemSpriteUrl = (name: string) => `${SPRITES}/items/${name}.png`;

// Round type symbol (Sword & Shield art)
export const typeIconUrl = (name: string) => {
  const id = TYPE_IDS[name];
  return id
    ? `${SPRITES}/types/generation-viii/sword-shield/small/${id}.png`
    : undefined;
};
