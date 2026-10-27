import { NavLink } from 'react-router';
import { cn } from '../Utils/cn';

// Switches between sibling pages of one section (e.g. Moves | Abilities)
export default function SectionTabs({
  tabs,
}: {
  tabs: { to: string; label: string }[];
}) {
  return (
    <nav aria-label="Section" className="mb-5 flex gap-2">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            cn(
              'inline-flex h-12 items-center rounded-full px-6 t-body font-bold transition',
              isActive
                ? 'bg-pk-navy text-white shadow-card'
                : 'border-2 border-pk-line bg-white hover:border-pk-navy'
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
];
