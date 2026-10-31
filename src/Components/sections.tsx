import type { ComponentType, SVGProps } from 'react';
import { BagIcon, BoltIcon, BookIcon, GlobeIcon, PokeballIcon } from './Icons';
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
    isActive: (path) =>
      /^\/(moves|move|abilities|ability|machines)(\/|$)/.test(path),
  },
  {
    id: 'items',
    label: 'Items',
    icon: BagIcon,
    to: () => '/items',
    isActive: (path) => /^\/(items|item|berries|berry)(\/|$)/.test(path),
  },
  {
    id: 'world',
    label: 'World',
    icon: GlobeIcon,
    to: () => '/games',
    isActive: (path) =>
      /^\/(games|game|regions|region|location|area|generations|generation)(\/|$)/.test(
        path
      ),
  },
  {
    id: 'guide',
    label: 'Guide',
    icon: BookIcon,
    to: () => '/guide',
    isActive: (path) => /^\/(guide|team|types|type)(\/|$)/.test(path),
  },
];
