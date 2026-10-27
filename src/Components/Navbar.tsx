import { Link, useLocation } from 'react-router';
import Pokeball from '../Images/pokeball.png';
import { SearchIcon } from './Icons';
import { SECTIONS } from './sections';
import { useSearch } from '../Utils/SearchContext';
import { useDexName } from '../Utils/dex';
import { cn } from '../Utils/cn';

const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad/.test(navigator.platform);

export default function Navbar() {
  const { pathname } = useLocation();
  const { openSearch } = useSearch();
  const pokedex = useDexName();

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-(--header-h) items-center gap-3 border-b-4 border-pk-yellow ds-gloss px-4 text-white shadow-[0_3px_0_var(--color-pk-navy-deep)] lg:px-6">
      <Link
        to="/"
        className="flex shrink-0 items-center gap-2.5"
        aria-label="Pokédex home"
      >
        <img className="size-10 lg:size-12" src={Pokeball} alt="" />
        <span className="mt-0.5 t-h3 ds-text-dark lg:text-[2.25rem]">
          Pokédex
        </span>
      </Link>

      <nav
        aria-label="Sections"
        className="ml-3 hidden items-center gap-1 lg:flex"
      >
        {SECTIONS.map((section) => {
          const active = section.isActive(pathname);
          return (
            <Link
              key={section.id}
              to={section.to(pokedex)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-full border-[3px] px-4 t-body font-bold transition',
                active
                  ? 'ds-gloss-yellow text-pk-navy ds-key'
                  : 'border-transparent text-white/85 hover:border-white/25 hover:bg-white/10 hover:text-white'
              )}
            >
              <section.icon className="size-5" />
              {section.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={openSearch}
        aria-label="Search"
        className="ml-auto hidden h-11 w-44 items-center gap-2.5 rounded-full bg-pk-navy-deep/60 px-4 text-left t-small text-white/75 shadow-[inset_0_2px_3px_rgb(0_0_0/0.35)] ring-1 ring-white/30 transition hover:bg-white/20 sm:flex xl:w-72"
      >
        <SearchIcon className="size-5 shrink-0" />
        <span className="flex-1 truncate">Search…</span>
        <kbd className="hidden rounded-md border border-white/30 px-1.5 py-0.5 t-label text-white/70 xl:inline">
          {isMac ? '⌘K' : 'Ctrl K'}
        </kbd>
      </button>
      <button
        type="button"
        onClick={openSearch}
        aria-label="Search"
        className="ml-auto flex size-11 items-center justify-center rounded-full bg-pk-navy-deep/60 ring-1 ring-white/30 sm:hidden"
      >
        <SearchIcon />
      </button>
    </header>
  );
}
