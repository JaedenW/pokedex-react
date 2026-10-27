import type { ComponentType, SVGProps } from 'react';
import { BagIcon, BoltIcon, GridIcon, PokeballIcon, TeamIcon } from './Icons';
import { dexHref } from '../Utils/dex';

export interface Section {
  id: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  to: (pokedex: string) => string;
  isActive: (pathname: string) => boolean;
}

// The top-level areas of the app, shared by the top bar and the phone tabs
export const SECTIONS: Section[] = [
  {
    id: 'pokedex',
    label: 'Pokédex',
    icon: PokeballIcon,
    to: dexHref,
    isActive: (path) => /^\/(dex|pokemon)(\/|$)/.test(path),
  },
  {
    id: 'moves',
    label: 'Moves',
    icon: BoltIcon,
    to: () => '/moves',
    isActive: (path) => /^\/(moves|move|abilities|ability)(\/|$)/.test(path),
  },
  {
    id: 'items',
    label: 'Items',
    icon: BagIcon,
    to: () => '/items',
    isActive: (path) => /^\/(items|item)(\/|$)/.test(path),
  },
  {
    id: 'types',
    label: 'Types',
    icon: GridIcon,
    to: () => '/types',
    isActive: (path) => /^\/types?(\/|$)/.test(path),
  },
  {
    id: 'team',
    label: 'Team',
    icon: TeamIcon,
    to: () => '/team',
    isActive: (path) => path.startsWith('/team'),
  },
];
