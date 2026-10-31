import { Link, useParams } from 'react-router';
import { useSuspenseQueries } from '@tanstack/react-query';
import { apiQuery, pathFromUrl, useApi } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import LinkChips from '../Components/LinkChips';
import PageHeader from '../Components/PageHeader';
import { Page, Panel } from '../Components/ui';
import NotFoundPage from './NotFoundPage';
import { guideResource, type GuideResource } from '../Utils/guide';
import { STAT_LABELS } from '../Utils/stats';
import { firstEnglish, getDisplayName } from '../Utils/text';
import { cn } from '../Utils/cn';
import type {
  Characteristic,
  ContestEffect,
  Nature,
  NamedAPIResourceList,
} from '../types/pokeapi';

const NATURE_STATS = [
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
];

function useAll<T>(resource: string) {
  const list = useApi<NamedAPIResourceList>(`${resource}?limit=200`);
  return useSuspenseQueries({
    queries: list.results.map((entry) => apiQuery<T>(pathFromUrl(entry.url))),
  }).map((result) => result.data);
}

/** The 5×5 grid: raised stat down the side, lowered stat along the top. */
function NatureGrid() {
  const natures = useAll<Nature>('nature');
  const find = (up: string, down: string) =>
    natures.find(
      (n) => n.increased_stat?.name === up && n.decreased_stat?.name === down
    );
  const neutral = natures.filter((n) => !n.increased_stat);

  return (
    <div className="space-y-4">
      <Panel title="Raises and lowers">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-separate border-spacing-1 text-center t-small">
            <thead>
              <tr>
                <th className="t-label font-normal text-pk-muted">
                  ▲ raises / lowers ▼
                </th>
                {NATURE_STATS.map((stat) => (
                  <th key={stat} className="t-label text-pk-red">
                    −{STAT_LABELS[stat]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NATURE_STATS.map((up) => (
                <tr key={up}>
                  <th scope="row" className="t-label text-green-700">
                    +{STAT_LABELS[up]}
                  </th>
                  {NATURE_STATS.map((down) => {
                    const nature = find(up, down);
                    return (
                      <td
                        key={down}
                        className={cn(
                          'rounded-lg',
                          nature ? 'bg-white' : 'bg-pk-line/40'
                        )}
                      >
                        {nature && (
                          <Link
                            to={`/guide/nature/${nature.name}`}
                            className="block rounded-lg border border-pk-line px-1.5 py-2 font-bold transition hover:border-pk-navy hover:bg-pk-yellow/30"
                          >
                            {getDisplayName(nature.name)}
                          </Link>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel title="No stat change">
        <LinkChips
          items={neutral.map((nature) => ({
            to: `/guide/nature/${nature.name}`,
            label: getDisplayName(nature.name),
          }))}
        />
      </Panel>
    </div>
  );
}

function CharacteristicTable() {
  const rows = useAll<Characteristic>('characteristic');
  const stats = [...new Set(rows.map((row) => row.highest_stat.name))];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {stats.map((stat) => (
        <Panel key={stat} title={`Highest IV: ${STAT_LABELS[stat] ?? stat}`}>
          <dl className="space-y-2">
            {rows
              .filter((row) => row.highest_stat.name === stat)
              .sort((a, b) => a.gene_modulo - b.gene_modulo)
              .map((row) => (
                <div key={row.id}>
                  <dt className="t-body font-bold">
                    {firstEnglish(row.descriptions)?.description ?? '—'}
                  </dt>
                  <dd className="t-small text-pk-muted">
                    IV {row.possible_values.join(', ')}
                  </dd>
                </div>
              ))}
          </dl>
        </Panel>
      ))}
    </div>
  );
}

function ContestEffects({ resource }: { resource: string }) {
  const effects = useAll<ContestEffect>(resource);

  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {effects.map((effect) => (
        <li key={effect.id} className="ds-frame p-4">
          <p className="t-body">
            {firstEnglish(effect.flavor_text_entries)?.flavor_text}
          </p>
          {effect.effect_entries && (
            <p className="mt-1 t-small text-pk-muted">
              {firstEnglish(effect.effect_entries)?.effect}
            </p>
          )}
          <p className="mt-2 t-label text-pk-muted">
            Appeal {effect.appeal}
            {effect.jam !== undefined && ` · Jam ${effect.jam}`}
          </p>
          {effect.moves && (
            <p className="mt-2 t-small">
              {effect.moves.map((move, index) => (
                <span key={move.name}>
                  {index > 0 && ', '}
                  <Link
                    to={`/move/${move.name}`}
                    className="font-bold text-pk-navy underline-offset-2 hover:underline"
                  >
                    {getDisplayName(move.name)}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

function NamedList({ resource }: { resource: GuideResource }) {
  const list = useApi<NamedAPIResourceList>(`${resource.id}?limit=200`);
  return (
    <Panel>
      <LinkChips
        items={list.results.map((entry) => ({
          to: `/guide/${resource.id}/${entry.name}`,
          label: getDisplayName(entry.name),
        }))}
      />
    </Panel>
  );
}

export default function GuideListPage() {
  const { resource: id = '' } = useParams();
  const resource = guideResource(id);
  useDocumentTitle(resource?.title ?? 'Guide');

  if (!resource) return <NotFoundPage />;

  return (
    <Page wide={id === 'nature'}>
      <PageHeader
        back="/guide"
        eyebrow={<Link to="/guide">Guide</Link>}
        title={resource.title}
        subtitle={resource.blurb}
      />
      {id === 'nature' ? (
        <NatureGrid />
      ) : id === 'characteristic' ? (
        <CharacteristicTable />
      ) : resource.numbered ? (
        <ContestEffects resource={id} />
      ) : (
        <NamedList resource={resource} />
      )}
    </Page>
  );
}
