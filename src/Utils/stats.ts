export const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

export const STAT_COLOURS: Record<string, string> = {
  hp: '#C22E28',
  attack: '#EE8130',
  defense: '#F7D02C',
  'special-attack': '#6390F0',
  'special-defense': '#7AC74C',
  speed: '#F95587',
};

/** A battle stat at a level, assuming 31 IVs and a neutral or boosting nature. */
export function calcStat(
  base: number,
  level: number,
  { isHp = false, evs = 0, nature = 1 } = {}
) {
  const core = Math.floor(
    ((2 * base + 31 + Math.floor(evs / 4)) * level) / 100
  );
  if (isHp) return base === 1 ? 1 : core + level + 10;
  return Math.floor((core + 5) * nature);
}

export const baseStatTotal = (stats: { base_stat: number }[]) =>
  stats.reduce((sum, stat) => sum + stat.base_stat, 0);

/** Share of Pokémon of each gender: null when genderless. */
export function genderRatio(genderRate: number) {
  if (genderRate < 0) return null;
  const female = (genderRate / 8) * 100;
  return { female, male: 100 - female };
}

// Egg cycles are 257 steps in the modern games (255 in the older ones)
export const hatchSteps = (hatchCounter: number) => (hatchCounter + 1) * 255;

// Rough catch chance with a plain Poké Ball at full health
export function catchChance(captureRate: number) {
  return Math.min(100, (captureRate / 765) * 100);
}
