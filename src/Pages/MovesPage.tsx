import React from 'react';
import { useSearchParams } from 'react-router';
import { moveIndexPath, useApi, useOptionalApi } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import MoveRowList from '../Components/MoveRowList';
import PageHeader from '../Components/PageHeader';
import SectionTabs, { MOVE_TABS } from '../Components/SectionTabs';
import { Chip, Page, Panel, SearchInput, SelectBox } from '../Components/ui';
import { rankMatch } from '../Utils/search';
import { TYPES } from '../Utils/typeChart';
import { getDisplayName } from '../Utils/text';
import { cn } from '../Utils/cn';
import type { DamageClass, NamedAPIResourceList, Type } from '../types/pokeapi';

const CLASSES = ['physical', 'special', 'status'];

export default function MovesPage() {
  useDocumentTitle('Moves');
  const index = useApi<NamedAPIResourceList>(moveIndexPath);
  const [params, setParams] = useSearchParams();
  const [isPending, startTransition] = React.useTransition();
  const query = params.get('q') ?? '';
  const type = params.get('type') ?? '';
  const damageClass = params.get('class') ?? '';
  const sort = params.get('sort') ?? 'id';
  const deferredQuery = React.useDeferredValue(query);

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

  // names of moves of the chosen type and class, from PokeAPI's own lists
  const typeMoves = useOptionalApi<Type>(type && `type/${type}`)?.moves;
  const classMoves = useOptionalApi<DamageClass>(
    damageClass && `move-damage-class/${damageClass}`
  )?.moves;

  const items = React.useMemo(() => {
    const inType = typeMoves && new Set(typeMoves.map((m) => m.name));
    const inClass = classMoves && new Set(classMoves.map((m) => m.name));
    let list = index.results.filter(
      (move) =>
        (!inType || inType.has(move.name)) &&
        (!inClass || inClass.has(move.name)) &&
        (!deferredQuery || rankMatch(deferredQuery, move.name) !== Infinity)
    );
    if (sort === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list.map((move) => ({ name: move.name }));
  }, [index, typeMoves, classMoves, deferredQuery, sort]);

  return (
    <Page>
      <PageHeader title="Moves" subtitle={`${index.count} moves`} />
      <SectionTabs tabs={MOVE_TABS} />

      <Panel className="mb-5" bodyClassName="space-y-3 sm:space-y-4">
        <div className="flex flex-wrap gap-3">
          <SearchInput
            label="Search moves"
            placeholder="Search moves…"
            value={query}
            onChange={(value) => setParam('q', value || null)}
            className="min-w-52 flex-1"
          />
          <SelectBox
            label="Type"
            value={type}
            onChange={(value) => setParam('type', value || null)}
            className="w-44"
          >
            <option value="">All types</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {getDisplayName(t)}
              </option>
            ))}
          </SelectBox>
          <SelectBox
            label="Sort by"
            value={sort}
            onChange={(value) =>
              setParam('sort', value === 'id' ? null : value)
            }
            className="w-40"
          >
            <option value="id">Oldest first</option>
            <option value="name">Name A–Z</option>
          </SelectBox>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={!damageClass} onClick={() => setParam('class', null)}>
            Any class
          </Chip>
          {CLASSES.map((c) => (
            <Chip
              key={c}
              active={damageClass === c}
              onClick={() => setParam('class', damageClass === c ? null : c)}
            >
              {getDisplayName(c)}
            </Chip>
          ))}
          <span className="ml-auto t-small text-pk-muted">
            {items.length} shown
          </span>
        </div>
      </Panel>

      <div className={cn('transition-opacity', isPending && 'opacity-60')}>
        <MoveRowList
          items={items}
          resetKey={`${deferredQuery}|${type}|${damageClass}|${sort}`}
          emptyTitle="No moves match these filters"
        />
      </div>
    </Page>
  );
}
