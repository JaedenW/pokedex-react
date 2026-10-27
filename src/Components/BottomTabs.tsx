import { Link, useLocation } from 'react-router';
import { SECTIONS } from './sections';
import { useDexName } from '../Utils/dex';
import { cn } from '../Utils/cn';

// Thumb-reach navigation for phones and tablets
export default function BottomTabs() {
  const { pathname } = useLocation();
  const pokedex = useDexName();

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-40 flex h-(--tabbar-h) bg-pk-yellow pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-3px_12px_rgba(6,26,64,0.25)] lg:hidden"
    >
      {SECTIONS.map((section) => {
        const active = section.isActive(pathname);
        return (
          <Link
            key={section.id}
            to={section.to(pokedex)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 border-t-4 t-label font-bold transition',
              active
                ? 'border-pk-navy bg-pk-paper/60 text-pk-navy'
                : 'border-transparent text-pk-navy/70 active:bg-pk-paper/40'
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
