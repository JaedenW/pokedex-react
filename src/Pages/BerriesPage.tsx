import React from 'react';
import { Link, useSearchParams } from 'react-router';
import { useSuspenseQueries } from '@tanstack/react-query';
import { apiQuery, useApi } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import ItemImage from '../Components/ItemImage';
import PageHeader from '../Components/PageHeader';
import SectionTabs, { ITEM_TABS } from '../Components/SectionTabs';
import {
  EmptyState,
  Page,
  Panel,
  SearchInput,
  SelectBox,
} from '../Components/ui';
import { rankMatch } from '../Utils/search';
import { getDisplayName } from '../Utils/text';
import type { Berry, NamedAPIResourceList } from '../types/pokeapi';

const FLAVOURS = ['spicy', 'dry', 'sweet', 'bitter', 'sour'];

/** A berry's strongest flavours, strongest first. */
const berryFlavours = (berry: Berry) =>
  berry.flavors
    .filter((f) => f.potency > 0)
    .sort((a, b) => b.potency - a.potency);

export default function BerriesPage() {
  useDocumentTitle('Berries');
  const list = useApi<NamedAPIResourceList>('berry?limit=100');
  const firmnesses = useApi<NamedAPIResourceList>('berry-firmness?limit=20');
  const berries = useSuspenseQueries({
    queries: list.results.map((b) => apiQuery<Berry>(`berry/${b.name}`)),
  }).map((result) => result.data);
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const flavour = params.get('flavour') ?? '';
  const firmness = params.get('firmness') ?? '';
  const deferred = React.useDeferredValue(query);

  function setParam(key: string, value: string) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );
  }

  const shown = berries.filter(
    (berry) =>
      (!deferred || rankMatch(deferred, berry.name) !== Infinity) &&
      (!firmness || berry.firmness.name === firmness) &&
      (!flavour || berryFlavours(berry)[0]?.flavor.name === flavour)
  );

  return (
    <Page wide>
      <PageHeader title="Berries" subtitle={`${berries.length} berries`} />
      <SectionTabs tabs={ITEM_TABS} />
      <Panel className="mb-5">
        <div className="flex flex-wrap gap-3">
          <SearchInput
            label="Search berries"
            placeholder="Search berries…"
            value={query}
            onChange={(value) => setParam('q', value)}
            className="min-w-52 flex-1"
          />
          <SelectBox
            label="Main flavour"
            value={flavour}
            onChange={(value) => setParam('flavour', value)}
            className="w-48"
          >
            <option value="">Any flavour</option>
            {FLAVOURS.map((name) => (
              <option key={name} value={name}>
                {getDisplayName(name)}
              </option>
            ))}
          </SelectBox>
          <SelectBox
            label="Firmness"
            value={firmness}
            onChange={(value) => setParam('firmness', value)}
            className="w-48"
          >
            <option value="">Any firmness</option>
            {firmnesses.results.map((f) => (
              <option key={f.name} value={f.name}>
                {getDisplayName(f.name)}
              </option>
            ))}
          </SelectBox>
        </div>
      </Panel>

      {shown.length ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {shown.map((berry) => (
            <li key={berry.name}>
              <Link
                to={`/berry/${berry.name}`}
                className="flex h-full flex-col items-center ds-frame ds-frame-hover px-2 pt-3 pb-3 text-center transition"
              >
                <ItemImage name={berry.item.name} className="size-14" />
                <span className="mt-1 t-h3 ds-text">
                  {getDisplayName(berry.name)}
                </span>
                <span className="mt-0.5 t-small text-pk-muted">
                  {berryFlavours(berry)
                    .slice(0, 2)
                    .map((f) => getDisplayName(f.flavor.name))
                    .join(' · ') || 'No flavour'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No berries match these filters" />
      )}
    </Page>
  );
}
