import React from 'react';
import { Link, useLocation } from 'react-router';
import { useApi, useRegionData } from '../api/pokeapi';
import { dexHref } from '../Utils/dex';
import { getDisplayName, getPokedexLabel } from '../Utils/text';
import { cn } from '../Utils/cn';
import { ChevronDownIcon } from './Icons';
import { Loading, Modal, buttonClass } from './ui';
import type { NamedAPIResourceList } from '../types/pokeapi';

function DexChip({
  to,
  current,
  children,
}: {
  to: string;
  current: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'inline-flex h-10 items-center rounded-full px-4 t-small font-bold ds-key transition',
        current
          ? 'ds-gloss text-white ds-text-dark'
          : 'ds-gloss-silver hover:brightness-105'
      )}
    >
      {children}
    </Link>
  );
}

function RegionCard({ name, current }: { name: string; current: string }) {
  const region = useRegionData(name);
  if (!region.pokedexes.length) return null; // e.g. Orre has no Pokédex yet

  return (
    <section className="ds-frame p-4">
      <h3 className="mb-3 flex items-center gap-2.5 t-h3">
        <span aria-hidden="true" className="size-2.5 rotate-45 bg-pk-yellow" />
        {getDisplayName(name)}
      </h3>
      <div className="flex flex-wrap gap-2">
        {region.pokedexes.map((dex) => (
          <DexChip
            key={dex.name}
            to={dexHref(dex.name)}
            current={dex.name === current}
          >
            {getPokedexLabel(dex.name, name)
              .toLowerCase()
              .replace(/^./, (c) => c.toUpperCase())}
          </DexChip>
        ))}
      </div>
    </section>
  );
}

function PickerContent({ current }: { current: string }) {
  const regions = useApi<NamedAPIResourceList>('region?limit=100');

  return (
    <div className="space-y-3">
      <Link
        to={dexHref('national')}
        aria-current={current === 'national' ? 'page' : undefined}
        className={cn(
          'flex items-center justify-between gap-3 rounded-xl border-2 p-4 transition',
          current === 'national'
            ? 'border-pk-navy bg-pk-navy text-white'
            : 'border-pk-yellow bg-pk-yellow/30 hover:bg-pk-yellow/60'
        )}
      >
        <span>
          <span className="block t-h3">National Pokédex</span>
          <span className="block t-small opacity-75">
            Every Pokémon, from #001 onwards
          </span>
        </span>
        <span className="t-label opacity-75">All regions</span>
      </Link>
      <div className="grid gap-3 sm:grid-cols-2">
        {regions.results.map((region) => (
          <RegionCard key={region.name} name={region.name} current={current} />
        ))}
      </div>
    </div>
  );
}

/** Opens a sheet listing every region and its Pokédexes. */
export default function DexPicker({ pokedex }: { pokedex: string }) {
  const [open, setOpen] = React.useState(false);
  const { key } = useLocation();

  // choosing a Pokédex navigates, which closes the sheet
  React.useEffect(() => setOpen(false), [key]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={buttonClass('primary', 'md')}
      >
        Change Pokédex
        <ChevronDownIcon className="size-5" />
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        label="Choose a Pokédex"
      >
        <React.Suspense fallback={<Loading />}>
          <PickerContent current={pokedex} />
        </React.Suspense>
      </Modal>
    </>
  );
}
