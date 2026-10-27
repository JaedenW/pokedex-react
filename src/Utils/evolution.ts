import type { EvolutionDetail, NamedAPIResource } from '../types/pokeapi';
import { getDisplayName } from './text';

const resource = (value: EvolutionDetail[string]) =>
  value && typeof value === 'object' ? (value as NamedAPIResource) : null;

const label = (value: EvolutionDetail[string]) => {
  const named = resource(value);
  return named ? getDisplayName(named.name) : '';
};

const TRIGGER_TEXT: Record<string, string> = {
  trade: 'Trade',
  shed: 'Level up with a free party slot and a Poké Ball',
  spin: 'Spin around while holding a sweet',
  'tower-of-darkness': 'Train at the Tower of Darkness',
  'tower-of-waters': 'Train at the Tower of Waters',
  'three-critical-hits': 'Land three critical hits in one battle',
  'take-damage': 'Take damage and walk to a spot',
  'recoil-damage': 'Take recoil damage',
  'agile-style-move': 'Use Agile Style Move',
  'strong-style-move': 'Use Strong Style Move',
};

/** A readable summary of what it takes to evolve, e.g. "Level 16". */
export function describeEvolution(detail: EvolutionDetail) {
  const parts: string[] = [];
  const trigger = resource(detail.trigger)?.name;

  if (trigger === 'use-item' && detail.item) {
    parts.push(`Use ${label(detail.item)}`);
  } else if (trigger && TRIGGER_TEXT[trigger]) {
    parts.push(TRIGGER_TEXT[trigger]);
  } else if (detail.min_level) {
    parts.push(`Level ${detail.min_level}`);
  } else {
    parts.push('Level up');
  }

  if (trigger !== 'use-item' && detail.min_level && trigger !== 'level-up') {
    parts[0] = `${parts[0]} (Level ${detail.min_level})`;
  }
  if (detail.held_item) parts.push(`holding ${label(detail.held_item)}`);
  if (detail.known_move) parts.push(`knowing ${label(detail.known_move)}`);
  if (detail.known_move_type) {
    parts.push(`knowing a ${label(detail.known_move_type)}-type move`);
  }
  if (detail.min_happiness) parts.push(`friendship ${detail.min_happiness}+`);
  if (detail.min_affection) parts.push(`affection ${detail.min_affection}+`);
  if (detail.min_beauty) parts.push(`beauty ${detail.min_beauty}+`);
  if (detail.time_of_day) parts.push(`during the ${detail.time_of_day}`);
  if (detail.location) parts.push(`at ${label(detail.location)}`);
  if (detail.gender === 1) parts.push('female only');
  if (detail.gender === 2) parts.push('male only');
  if (detail.needs_overworld_rain) parts.push('while it rains');
  if (detail.turn_upside_down) parts.push('holding the console upside down');
  if (detail.party_species)
    parts.push(`with ${label(detail.party_species)} in the party`);
  if (detail.party_type)
    parts.push(`with a ${label(detail.party_type)}-type in the party`);
  if (detail.trade_species) parts.push(`for ${label(detail.trade_species)}`);
  if (detail.relative_physical_stats === 1)
    parts.push('Attack higher than Defense');
  if (detail.relative_physical_stats === -1)
    parts.push('Defense higher than Attack');
  if (detail.relative_physical_stats === 0)
    parts.push('Attack equal to Defense');

  return parts[0] + (parts.length > 1 ? `, ${parts.slice(1).join(', ')}` : '');
}
