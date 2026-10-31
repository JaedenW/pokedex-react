/** A reference resource served by the shared Guide pages. */
export interface GuideResource {
  id: string;
  title: string;
  blurb: string;
  /** Has no names: every entry is loaded and shown on the list page */
  numbered?: boolean;
}

export interface GuideLink {
  to: string;
  title: string;
  blurb: string;
}

export const GUIDE_TOOLS: GuideLink[] = [
  {
    to: '/team',
    title: 'Team planner',
    blurb: 'Theorycraft a team of six for any game',
  },
  {
    to: '/types',
    title: 'Type chart',
    blurb: 'Who beats what, plus a defence calculator',
  },
  {
    to: '/guide/nature',
    title: 'Natures',
    blurb: 'Which stats each nature raises and lowers',
  },
  {
    to: '/berries',
    title: 'Berries',
    blurb: 'Flavours, growth and Natural Gift',
  },
];

export const GUIDE_GROUPS: { title: string; resources: GuideResource[] }[] = [
  {
    title: 'Pokémon',
    resources: [
      {
        id: 'nature',
        title: 'Natures',
        blurb: 'Stat changes, flavours and battle styles',
      },
      {
        id: 'stat',
        title: 'Stats',
        blurb: 'What raises and lowers each stat',
      },
      {
        id: 'characteristic',
        title: 'Characteristics',
        blurb: 'What a summary line says about a Pokémon’s best IV',
        numbered: true,
      },
      {
        id: 'egg-group',
        title: 'Egg groups',
        blurb: 'Who can breed with whom',
      },
      {
        id: 'growth-rate',
        title: 'Growth rates',
        blurb: 'EXP needed to reach each level',
      },
      {
        id: 'gender',
        title: 'Genders',
        blurb: 'Gender ratios across Pokémon',
      },
      {
        id: 'pokemon-habitat',
        title: 'Habitats',
        blurb: 'Where Pokémon live, from the FireRed Pokédex',
      },
      {
        id: 'pokemon-color',
        title: 'Colours',
        blurb: 'The Pokédex colour categories',
      },
      {
        id: 'pokemon-shape',
        title: 'Shapes',
        blurb: 'The Pokédex body shapes',
      },
      {
        id: 'evolution-trigger',
        title: 'Evolution triggers',
        blurb: 'The ways a Pokémon can evolve',
      },
      {
        id: 'evolution-variable',
        title: 'Evolution variables',
        blurb: 'Hidden values some evolutions depend on',
      },
    ],
  },
  {
    title: 'Moves',
    resources: [
      {
        id: 'move-damage-class',
        title: 'Damage classes',
        blurb: 'Physical, special and status',
      },
      {
        id: 'move-category',
        title: 'Move categories',
        blurb: 'What a move broadly does',
      },
      {
        id: 'move-ailment',
        title: 'Status ailments',
        blurb: 'Moves that inflict each condition',
      },
      {
        id: 'move-target',
        title: 'Move targets',
        blurb: 'Who a move can hit',
      },
      {
        id: 'move-learn-method',
        title: 'Learn methods',
        blurb: 'How Pokémon can learn moves',
      },
      {
        id: 'move-battle-style',
        title: 'Battle styles',
        blurb: 'Battle Palace move preferences',
      },
    ],
  },
  {
    title: 'Items and berries',
    resources: [
      {
        id: 'item-pocket',
        title: 'Bag pockets',
        blurb: 'Where items are kept in the bag',
      },
      {
        id: 'item-attribute',
        title: 'Item attributes',
        blurb: 'How items can be used',
      },
      {
        id: 'item-fling-effect',
        title: 'Fling effects',
        blurb: 'What each item does when Flung',
      },
      {
        id: 'berry-firmness',
        title: 'Berry firmness',
        blurb: 'From very soft to super hard',
      },
      {
        id: 'berry-flavor',
        title: 'Berry flavours',
        blurb: 'Which berries taste of what',
      },
      {
        id: 'currency',
        title: 'Currencies',
        blurb: 'Everything items are priced in',
      },
    ],
  },
  {
    title: 'Encounters',
    resources: [
      {
        id: 'encounter-method',
        title: 'Encounter methods',
        blurb: 'Walking, fishing, Headbutt and more',
      },
      {
        id: 'encounter-condition',
        title: 'Encounter conditions',
        blurb: 'Time of day, swarms, radio and more',
      },
      {
        id: 'pal-park-area',
        title: 'Pal Park',
        blurb: 'Which Pokémon appear in each area',
      },
    ],
  },
  {
    title: 'Contests and Pokéathlon',
    resources: [
      {
        id: 'contest-type',
        title: 'Contest types',
        blurb: 'Cool, Beauty, Cute, Smart and Tough',
      },
      {
        id: 'contest-effect',
        title: 'Contest effects',
        blurb: 'Appeal and jam of each move effect',
        numbered: true,
      },
      {
        id: 'super-contest-effect',
        title: 'Super Contest effects',
        blurb: 'The Diamond and Pearl contest effects',
        numbered: true,
      },
      {
        id: 'pokeathlon-stat',
        title: 'Pokéathlon stats',
        blurb: 'Which natures affect each stat',
      },
    ],
  },
  {
    title: 'Data',
    resources: [
      {
        id: 'language',
        title: 'Languages',
        blurb: 'The languages the games are in',
      },
    ],
  },
];

export const GUIDE_RESOURCES = GUIDE_GROUPS.flatMap((g) => g.resources);

export const guideResource = (id: string) =>
  GUIDE_RESOURCES.find((resource) => resource.id === id);
