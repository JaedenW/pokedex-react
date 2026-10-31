import React from 'react';
import { Link } from 'react-router';
import { EmptyState, buttonClass } from './ui';

export interface ChipLink {
  to: string;
  label: string;
}

const BATCH = 60;

/** A compact set of links, for lists too long or too plain to need rows. */
export default function LinkChips({
  items,
  emptyTitle = 'Nothing here',
}: {
  items: ChipLink[];
  emptyTitle?: string;
}) {
  const [count, setCount] = React.useState(BATCH);

  if (!items.length) return <EmptyState title={emptyTitle} />;

  return (
    <div>
      <ul className="flex flex-wrap gap-2">
        {items.slice(0, count).map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="inline-flex min-h-10 items-center rounded-full ds-gloss-silver px-4 py-1 t-small font-bold ds-key transition hover:brightness-105"
            >
              {item.label}
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
