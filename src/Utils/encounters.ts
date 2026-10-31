import type { EncounterDetail } from '../types/pokeapi';

export interface MethodSummary {
  method: string;
  conditions: string[];
  minLevel: number;
  maxLevel: number;
  chance: number;
}

// Combines duplicate method/condition rows into one line with summed chance
export function summarise(details: EncounterDetail[]) {
  const summary = new Map<string, MethodSummary>();
  for (const detail of details) {
    const conditions = detail.condition_values.map((c) => c.name);
    const key = `${detail.method.name}|${conditions.join(',')}`;
    const existing = summary.get(key);
    summary.set(key, {
      method: detail.method.name,
      conditions,
      minLevel: Math.min(existing?.minLevel ?? Infinity, detail.min_level),
      maxLevel: Math.max(existing?.maxLevel ?? 0, detail.max_level),
      chance: (existing?.chance ?? 0) + detail.chance,
    });
  }
  return [...summary.values()];
}
