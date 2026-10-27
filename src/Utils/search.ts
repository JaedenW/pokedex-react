const normalise = (text: string) =>
  text
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();

/** Lower is a better match; Infinity means the query doesn't match. */
export function rankMatch(query: string, name: string) {
  const q = normalise(query);
  const n = normalise(name);
  if (!q) return Infinity;
  if (n === q) return 0;
  if (n.startsWith(q)) return 1;
  if (n.split(' ').some((word) => word.startsWith(q))) return 2;
  if (n.includes(q)) return 3;
  return Infinity;
}

const idOf = (entry: { url?: string }) =>
  entry.url ? Number(entry.url.split('/').filter(Boolean).at(-1)) : 0;

/**
 * Best matches first. Ties go to the lower id (so Charmander comes before
 * Charcadet), then to the shorter name.
 */
export function searchNames<T extends { name: string; url?: string }>(
  query: string,
  entries: T[],
  limit: number
) {
  return entries
    .map((entry) => ({ entry, rank: rankMatch(query, entry.name) }))
    .filter(({ rank }) => rank !== Infinity)
    .sort(
      (a, b) =>
        a.rank - b.rank ||
        idOf(a.entry) - idOf(b.entry) ||
        a.entry.name.length - b.entry.name.length ||
        a.entry.name.localeCompare(b.entry.name)
    )
    .slice(0, limit)
    .map(({ entry }) => entry);
}
