import React from 'react';
import { Link, useSearchParams } from 'react-router';
import { abilityIndexPath, useApi } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import PageHeader from '../Components/PageHeader';
import SectionTabs, { MOVE_TABS } from '../Components/SectionTabs';
import {
  Chip,
  EmptyState,
  Page,
  Panel,
  SearchInput,
  buttonClass,
} from '../Components/ui';
import { rankMatch } from '../Utils/search';
import { useIntroducedByGame } from '../Hooks/useGame';
import { useSelection } from '../Utils/selection';
import { getDisplayName, versionGroupLabel } from '../Utils/text';
import type { NamedAPIResourceList } from '../types/pokeapi';

const BATCH = 90;

export default function AbilitiesPage() {
  useDocumentTitle('Abilities');
  const index = useApi<NamedAPIResourceList>(abilityIndexPath);
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const deferred = React.useDeferredValue(query);
  const [count, setCount] = React.useState(BATCH);
  const { game } = useSelection();
  const showAll = params.has('all');
  const introduced = useIntroducedByGame('abilities', showAll);

  const abilities = React.useMemo(
    () =>
      index.results
        .filter(
          (a) =>
            (!introduced || introduced.has(a.name)) &&
            (!deferred || rankMatch(deferred, a.name) !== Infinity)
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [index, deferred, introduced]
  );

  function setParam(key: string, value: string | null) {
    setCount(BATCH);
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

  return (
    <Page>
      <PageHeader title="Abilities" subtitle={`${index.count} abilities`} />
      <SectionTabs tabs={MOVE_TABS} />
      <Panel className="mb-5">
        <SearchInput
          label="Search abilities"
          placeholder="Search abilities…"
          value={query}
          onChange={(value) => setParam('q', value || null)}
        />
        {game && (
          <div className="mt-3 flex items-center gap-2">
            <Chip
              active={!showAll}
              onClick={() => setParam('all', showAll ? null : '1')}
            >
              Up to {versionGroupLabel(game)}
            </Chip>
            <span className="ml-auto t-small text-pk-muted">
              {abilities.length} shown
            </span>
          </div>
        )}
      </Panel>

      {abilities.length ? (
        <>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-2.5">
            {abilities.slice(0, count).map((ability) => (
              <li key={ability.name}>
                <Link
                  to={`/ability/${ability.name}`}
                  className="block ds-frame ds-frame-hover px-4 py-2.5 t-body font-bold transition"
                >
                  {getDisplayName(ability.name)}
                </Link>
              </li>
            ))}
          </ul>
          {count < abilities.length && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setCount((c) => c + BATCH)}
                className={buttonClass('primary', 'md')}
              >
                Show more ({abilities.length - count} left)
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState title="No abilities match" />
      )}
    </Page>
  );
}
