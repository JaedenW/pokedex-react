import { Link } from 'react-router';
import { idFromUrl, pathFromUrl, useEvolutionChain } from '../../api/pokeapi';
import { officialArtworkUrl } from '../../api/sprites';
import { pokemonHref } from '../../Utils/dex';
import { describeEvolution } from '../../Utils/evolution';
import { formatDexNumber, getDisplayName } from '../../Utils/text';
import { cn } from '../../Utils/cn';
import { ChevronRightIcon } from '../Icons';
import { Panel } from '../ui';
import type {
  ChainLink,
  NamedAPIResource,
  PokemonSpecies,
} from '../../types/pokeapi';

function EvolutionCard({
  species,
  current,
}: {
  species: NamedAPIResource;
  current: boolean;
}) {
  const id = idFromUrl(species.url);
  return (
    <Link
      to={pokemonHref(species.name)}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'flex w-40 shrink-0 flex-col items-center rounded-xl border-2 bg-white p-3 text-center transition hover:shadow-lift',
        current ? 'border-pk-navy shadow-card' : 'border-pk-line'
      )}
    >
      <img
        src={officialArtworkUrl(id)}
        alt=""
        loading="lazy"
        decoding="async"
        className="size-28 object-contain"
      />
      <span className="mt-1 t-label text-pk-muted">{formatDexNumber(id)}</span>
      <span className="t-body leading-tight font-bold">
        {getDisplayName(species.name)}
      </span>
    </Link>
  );
}

function Requirement({ link }: { link: ChainLink }) {
  // PokeAPI repeats identical requirements for regional variants
  const requirements = [
    ...new Set(link.evolution_details.map(describeEvolution)),
  ];
  const text = requirements.length ? requirements.join(' or ') : 'Evolves';
  return (
    <div className="flex max-w-48 flex-col items-center text-center t-small leading-tight text-pk-muted">
      <ChevronRightIcon className="size-6 shrink-0 rotate-90 text-pk-red sm:rotate-0" />
      <span>{text}</span>
    </div>
  );
}

function Branch({ link, current }: { link: ChainLink; current: string }) {
  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row">
      <EvolutionCard
        species={link.species}
        current={link.species.name === current}
      />
      {link.evolves_to.length > 0 && (
        <div className="flex flex-col gap-3">
          {link.evolves_to.map((next) => (
            <div
              key={next.species.name}
              className="flex flex-col items-center gap-2 sm:flex-row"
            >
              <Requirement link={next} />
              <Branch link={next} current={current} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EvolutionTab({ species }: { species: PokemonSpecies }) {
  const { chain } = useEvolutionChain(pathFromUrl(species.evolution_chain.url));
  const evolves = chain.evolves_to.length > 0;

  return (
    <Panel title="Evolution chain">
      <div className="flex justify-center overflow-x-auto py-2">
        <Branch link={chain} current={species.name} />
      </div>
      {!evolves && (
        <p className="text-center t-body text-pk-muted">
          {getDisplayName(species.name)} does not evolve.
        </p>
      )}
    </Panel>
  );
}
