import React from 'react';
import { Link, useSearchParams } from 'react-router';
import {
  itemCategoryIndexPath,
  itemIndexPath,
  useApi,
  useOptionalApi,
} from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import { useLoadMoreOnVisible } from '../Hooks/useLoadMoreOnVisible';
import ItemImage from '../Components/ItemImage';
import PageHeader from '../Components/PageHeader';
import {
  EmptyState,
  Page,
  Panel,
  SearchInput,
  SelectBox,
} from '../Components/ui';
import { rankMatch } from '../Utils/search';
import { getDisplayName } from '../Utils/text';
import { cn } from '../Utils/cn';
import type { ItemCategory, NamedAPIResourceList } from '../types/pokeapi';

const BATCH = 80;

export default function ItemsPage() {
  useDocumentTitle('Items');
  const index = useApi<NamedAPIResourceList>(itemIndexPath);
  const categories = useApi<NamedAPIResourceList>(itemCategoryIndexPath);
  const [params, setParams] = useSearchParams();
  const [isPending, startTransition] = React.useTransition();
  const query = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const deferred = React.useDeferredValue(query);

  function setParam(key: string, value: string | null) {
    startTransition(() => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (value) next.set(key, value);
          else next.delete(key);
          return next;
        },
        { replace: true }
      );
    });
  }

  const inCategory = useOptionalApi<ItemCategory>(
    category && `item-category/${category}`
  )?.items;

  const items = React.useMemo(() => {
    const allowed = inCategory && new Set(inCategory.map((i) => i.name));
    return index.results.filter(
      (item) =>
        (!allowed || allowed.has(item.name)) &&
        (!deferred || rankMatch(deferred, item.name) !== Infinity)
    );
  }, [index, inCategory, deferred]);

  const resetKey = `${deferred}|${category}`;
  const [count, setCount] = React.useState(BATCH);
  const [previousKey, setPreviousKey] = React.useState(resetKey);
  if (resetKey !== previousKey) {
    setPreviousKey(resetKey);
    setCount(BATCH);
  }
  const hasMore = count < items.length;
  const sentinelRef = useLoadMoreOnVisible(
    React.useCallback(() => setCount((c) => c + BATCH), []),
    hasMore,
    count
  );

  return (
    <Page>
      <PageHeader title="Items" subtitle={`${index.count} items`} />

      <Panel className="mb-5">
        <div className="flex flex-wrap gap-3">
          <SearchInput
            label="Search items"
            placeholder="Search items…"
            value={query}
            onChange={(value) => setParam('q', value || null)}
            className="min-w-52 flex-1"
          />
          <SelectBox
            label="Category"
            value={category}
            onChange={(value) => setParam('category', value || null)}
            className="w-64"
          >
            <option value="">All categories</option>
            {categories.results.map((c) => (
              <option key={c.name} value={c.name}>
                {getDisplayName(c.name)}
              </option>
            ))}
          </SelectBox>
        </div>
      </Panel>

      <div className={cn('transition-opacity', isPending && 'opacity-60')}>
        {items.length ? (
          <>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-2.5">
              {items.slice(0, count).map((item) => (
                <li key={item.name}>
                  <Link
                    to={`/item/${item.name}`}
                    className="flex h-full flex-col items-center ds-frame ds-frame-hover px-2 pt-3 pb-2.5 text-center transition"
                  >
                    <ItemImage name={item.name} className="size-14" />
                    <span className="mt-1.5 w-full t-small leading-tight font-bold break-words">
                      {getDisplayName(item.name)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {hasMore && (
              <div ref={sentinelRef} aria-hidden="true" className="h-0" />
            )}
          </>
        ) : (
          <EmptyState title="No items match these filters" />
        )}
      </div>
    </Page>
  );
}
