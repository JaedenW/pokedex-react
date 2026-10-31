import React from 'react';
import { Link } from 'react-router';
import { getDisplayName } from '../Utils/text';
import ItemImage from './ItemImage';
import { EmptyState, buttonClass } from './ui';
import type { NamedAPIResource } from '../types/pokeapi';

const BATCH = 48;

/** Item sprites linking to item pages. */
export default function ItemLinkGrid({
  items,
  emptyTitle = 'No items',
}: {
  items: NamedAPIResource[];
  emptyTitle?: string;
}) {
  const [count, setCount] = React.useState(BATCH);

  if (!items.length) return <EmptyState title={emptyTitle} />;

  return (
    <div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-2.5">
        {items.slice(0, count).map((item) => (
          <li key={item.name}>
            <Link
              to={`/item/${item.name}`}
              className="flex h-full flex-col items-center rounded-xl border border-pk-line bg-white px-1 pt-2 pb-2 text-center transition hover:border-pk-navy hover:shadow-card"
            >
              <ItemImage name={item.name} className="size-12" />
              <span className="mt-1 w-full t-small leading-tight font-bold break-words">
                {getDisplayName(item.name)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {count < items.length && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setCount((c) => c + BATCH)}
            className={buttonClass('primary', 'md')}
          >
            Show more ({items.length - count} left)
          </button>
        </div>
      )}
    </div>
  );
}
