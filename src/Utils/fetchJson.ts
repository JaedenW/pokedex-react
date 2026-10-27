export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, url: string) {
    super(`Request failed with ${status}: ${url}`);
    this.name = 'HttpError';
    this.status = status;
  }
}

export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new HttpError(res.status, url);
  return res.json();
}
