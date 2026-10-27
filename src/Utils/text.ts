import type { FlavorTextEntry, NamedAPIResource } from '../types/pokeapi';

export function getDisplayName(name: string, delim = '-') {
  return name
    .split(delim)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getPokedexLabel(pokedexName: string, regionName?: string) {
  const words = pokedexName
    .split('-')
    .filter((word) => word !== regionName && word);
  return words.length ? words.join(' ').toUpperCase() : 'ORIGINAL';
}

/** "generation-viii" -> "Generation VIII". */
export function formatGeneration(name: string) {
  const [, numeral = ''] = name.split('-');
  return `Generation ${numeral.toUpperCase()}`;
}

/** Zero-pads a Pokédex number: 7 -> "007", 1025 -> "1025". */
export const formatDexNumber = (value: number) =>
  `#${String(value).padStart(3, '0')}`;

/** PokeAPI flavour text contains hard line and page breaks. */
export const cleanFlavorText = (text: string) =>
  text
    .replace(/[\n\f­]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

type WithLanguage = { language: NamedAPIResource };

export const english = <T extends WithLanguage>(entries: T[] = []) =>
  entries.filter((entry) => entry.language.name === 'en');

export const firstEnglish = <T extends WithLanguage>(entries: T[] = []) =>
  english(entries)[0];

export const englishFlavorText = (entries: FlavorTextEntry[] = []) =>
  english(entries).map((entry) => ({
    ...entry,
    flavor_text: cleanFlavorText(entry.flavor_text ?? entry.text ?? ''),
  }));

/** Species name from a PokeAPI form name: "charizard-mega-x" -> "Mega X". */
export function formLabel(formName: string, speciesName: string) {
  if (formName === speciesName) return 'Default';
  const rest = formName.startsWith(`${speciesName}-`)
    ? formName.slice(speciesName.length + 1)
    : formName;
  return getDisplayName(rest);
}

/** "kanto-route-2-south-towns-area" -> "Kanto Route 2 South Towns Area". */
export const formatLocationName = (name: string) => getDisplayName(name);

const VERSION_GROUP_LABELS: Record<string, string> = {
  'red-green-japan': 'Red / Green (JP)',
  'blue-japan': 'Blue (JP)',
  'red-blue': 'Red / Blue',
  yellow: 'Yellow',
  'gold-silver': 'Gold / Silver',
  crystal: 'Crystal',
  'ruby-sapphire': 'Ruby / Sapphire',
  emerald: 'Emerald',
  'firered-leafgreen': 'FireRed / LeafGreen',
  'diamond-pearl': 'Diamond / Pearl',
  platinum: 'Platinum',
  'heartgold-soulsilver': 'HeartGold / SoulSilver',
  'black-white': 'Black / White',
  colosseum: 'Colosseum',
  xd: 'XD',
  'black-2-white-2': 'Black 2 / White 2',
  'x-y': 'X / Y',
  'omega-ruby-alpha-sapphire': 'Omega Ruby / Alpha Sapphire',
  'sun-moon': 'Sun / Moon',
  'ultra-sun-ultra-moon': 'Ultra Sun / Ultra Moon',
  'lets-go-pikachu-lets-go-eevee': "Let's Go Pikachu / Eevee",
  'sword-shield': 'Sword / Shield',
  'the-isle-of-armor': 'Isle of Armor',
  'the-crown-tundra': 'Crown Tundra',
  'brilliant-diamond-shining-pearl': 'Brilliant Diamond / Shining Pearl',
  'legends-arceus': 'Legends: Arceus',
  'scarlet-violet': 'Scarlet / Violet',
  'the-teal-mask': 'The Teal Mask',
  'the-indigo-disk': 'The Indigo Disk',
  'legends-za': 'Legends: Z-A',
  'mega-dimension': 'Mega Dimension',
  champions: 'Champions',
};

// Games in release order; PokeAPI lists them by id, which isn't chronological
const VERSION_GROUP_ORDER = Object.keys(VERSION_GROUP_LABELS);

export const compareVersionGroups = (a: string, b: string) =>
  (VERSION_GROUP_ORDER.indexOf(a) + 1 || 999) -
  (VERSION_GROUP_ORDER.indexOf(b) + 1 || 999);

export const versionGroupLabel = (name: string) =>
  VERSION_GROUP_LABELS[name] ?? getDisplayName(name);

const VERSION_LABELS: Record<string, string> = {
  firered: 'FireRed',
  leafgreen: 'LeafGreen',
  heartgold: 'HeartGold',
  soulsilver: 'SoulSilver',
  'omega-ruby': 'Omega Ruby',
  'alpha-sapphire': 'Alpha Sapphire',
  'lets-go-pikachu': "Let's Go Pikachu",
  'lets-go-eevee': "Let's Go Eevee",
  'black-2': 'Black 2',
  'white-2': 'White 2',
  'legends-arceus': 'Legends: Arceus',
  'legends-za': 'Legends: Z-A',
  xd: 'XD',
  x: 'X',
  y: 'Y',
};

export const versionLabel = (name: string) =>
  VERSION_LABELS[name] ?? getDisplayName(name);
