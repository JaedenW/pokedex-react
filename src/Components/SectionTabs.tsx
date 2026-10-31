import { NavLink } from 'react-router';
import { cn } from '../Utils/cn';

// Switches between sibling pages of one section (e.g. Moves | Abilities)
export default function SectionTabs({
  tabs,
}: {
  tabs: { to: string; label: string }[];
}) {
  return (
    <nav
      aria-label="Section"
      className="mb-5 flex gap-1.5 overflow-x-auto px-1 pt-1 pb-2 sm:gap-2"
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            cn(
              'inline-flex h-11 flex-1 items-center justify-center rounded-full px-2 t-small font-bold whitespace-nowrap ds-key transition sm:h-12 sm:flex-none sm:px-6 sm:t-body',
              isActive
                ? 'ds-gloss text-white ds-text-dark'
                : 'ds-gloss-silver hover:brightness-105'
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}

export const MOVE_TABS = [
  { to: '/moves', label: 'Moves' },
  { to: '/abilities', label: 'Abilities' },
  { to: '/machines', label: 'TMs & HMs' },
];

export const ITEM_TABS = [
  { to: '/items', label: 'Items' },
  { to: '/berries', label: 'Berries' },
];

export const WORLD_TABS = [
  { to: '/games', label: 'Games' },
  { to: '/regions', label: 'Regions' },
  { to: '/generations', label: 'Generations' },
];
