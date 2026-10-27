import React from 'react';
import { Link, useParams } from 'react-router';
import { useMove } from '../api/pokeapi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import DetailBanner from '../Components/DetailBanner';
import { DamageClassPill, effectText } from '../Components/MoveRow';
import PokemonLinkGrid from '../Components/PokemonLinkGrid';
import TypeBadge from '../Components/TypeBadge';
import { Page, Panel, SelectBox, StatTile } from '../Components/ui';
import { typeColours } from '../Utils/typeColours';
import {
  englishFlavorText,
  firstEnglish,
  formatGeneration,
  getDisplayName,
  versionGroupLabel,
} from '../Utils/text';

const META_LABELS: [string, string, string][] = [
  ['crit_rate', 'Critical hit stage', ''],
  ['drain', 'Drain', '%'],
  ['healing', 'Healing', '%'],
  ['flinch_chance', 'Flinch chance', '%'],
  ['ailment_chance', 'Status chance', '%'],
  ['stat_chance', 'Stat change chance', '%'],
];

function range(min: number | null, max: number | null) {
  return min === max ? max : `${min}–${max}`;
}

export default function MovePage() {
  const { name = '' } = useParams();
  const move = useMove(name);
  useDocumentTitle(getDisplayName(name));

  const effect = firstEnglish(move.effect_entries);
  const flavour = React.useMemo(
    () => englishFlavorText(move.flavor_text_entries),
    [move]
  );
  const [group, setGroup] = React.useState(
    flavour.at(-1)?.version_group?.name ?? ''
  );
  const flavourText = flavour.find((f) => f.version_group?.name === group);
  const meta = move.meta;
  const ailment =
    meta?.ailment.name !== 'none' ? meta?.ailment.name : undefined;
  const metaValues = meta as unknown as Record<string, number> | null;

  return (
    <Page>
      <DetailBanner
        back="/moves"
        colour={typeColours[move.type.name]}
        eyebrow={`Move · ${formatGeneration(move.generation.name)}`}
        title={getDisplayName(name)}
        badges={
          <>
            <TypeBadge name={move.type.name} size="lg" icon />
            <DamageClassPill name={move.damage_class.name} />
          </>
        }
      />

      <dl className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile label="Power" value={move.power ?? '—'} />
        <StatTile
          label="Accuracy"
          value={move.accuracy ? `${move.accuracy}%` : '—'}
        />
        <StatTile label="PP" value={move.pp ?? '—'} />
        <StatTile
          label="Priority"
          value={move.priority > 0 ? `+${move.priority}` : move.priority}
        />
        <StatTile
          label="Target"
          value={
            <span className="t-body">{getDisplayName(move.target.name)}</span>
          }
        />
        <StatTile
          label="Effect chance"
          value={move.effect_chance ? `${move.effect_chance}%` : '—'}
        />
      </dl>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Panel title="What it does">
          <p className="t-body">
            {effect
              ? effectText(effect.effect, move.effect_chance)
              : 'No description available.'}
          </p>
          {ailment && (
            <p className="mt-3 t-small text-pk-muted">
              Can cause{' '}
              <strong className="text-pk-ink">{getDisplayName(ailment)}</strong>
              .
            </p>
          )}
          {meta && (
            <ul className="mt-4 flex flex-wrap gap-2 t-small">
              {META_LABELS.filter(([key]) => (metaValues?.[key] ?? 0) > 0).map(
                ([key, label, unit]) => (
                  <li
                    key={key}
                    className="rounded-lg border border-pk-line bg-white px-3 py-1"
                  >
                    {label}:{' '}
                    <strong>
                      {metaValues?.[key]}
                      {unit}
                    </strong>
                  </li>
                )
              )}
              {meta.max_hits ? (
                <li className="rounded-lg border border-pk-line bg-white px-3 py-1">
                  Hits: <strong>{range(meta.min_hits, meta.max_hits)}</strong>
                </li>
              ) : null}
              {meta.max_turns ? (
                <li className="rounded-lg border border-pk-line bg-white px-3 py-1">
                  Turns:{' '}
                  <strong>{range(meta.min_turns, meta.max_turns)}</strong>
                </li>
              ) : null}
            </ul>
          )}
        </Panel>

        {flavour.length > 0 && (
          <Panel
            title="In-game text"
            actions={
              <SelectBox
                label="Game"
                value={group}
                onChange={setGroup}
                className="w-56"
              >
                {flavour.map((f) => (
                  <option
                    key={f.version_group?.name}
                    value={f.version_group?.name}
                  >
                    {versionGroupLabel(f.version_group?.name ?? '')}
                  </option>
                ))}
              </SelectBox>
            }
          >
            <p className="t-body">{flavourText?.flavor_text}</p>
          </Panel>
        )}
      </div>

      <Panel
        title={`Learned by ${move.learned_by_pokemon.length} Pokémon`}
        actions={
          <Link
            to={`/moves?type=${move.type.name}`}
            className="t-small font-bold text-pk-red underline underline-offset-2"
          >
            More {getDisplayName(move.type.name)} moves
          </Link>
        }
      >
        <PokemonLinkGrid
          items={move.learned_by_pokemon.map((pokemon) => ({ pokemon }))}
          emptyTitle="No Pokémon learn this move"
        />
      </Panel>
    </Page>
  );
}
