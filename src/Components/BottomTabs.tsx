import { Link, useLocation } from 'react-router';
import { SECTIONS } from './sections';
import { useDexName } from '../Utils/selection';
import { cn } from '../Utils/cn';

// Thumb-reach navigation for phones and tablets
export default function BottomTabs() {
  const { pathname } = useLocation();
  const pokedex = useDexName();

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-40 flex h-(--tabbar-h) border-t-4 border-pk-yellow ds-gloss pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
    >
      {SECTIONS.map((section) => {
        const active = section.isActive(pathname);
        return (
          <Link
            key={section.id}
            to={section.to(pokedex)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'm-1 flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl border-[3px] t-label font-bold transition',
              active
                ? 'ds-gloss-yellow text-pk-navy ds-key'
                : 'border-transparent text-white/80 active:bg-white/15'
            )}
          >
            <section.icon className="size-6" />
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}
