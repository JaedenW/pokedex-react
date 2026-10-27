import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import { apiQuery } from '../api/pokeapi';
import type { VersionGroup } from '../types/pokeapi';
import { DEFAULT_DEX, dexHref } from './dex';

/**
 * The game and Pokédex everything else is read through. It lives for the
 * browser session (sessionStorage) and is not tied to any one page.
 */
interface Selection {
  /** A version group such as "diamond-pearl", or null for no particular game */
  game: string | null;
  dex: string;
}

const STORAGE_KEY = 'pokedex.selection';
const DEX_PATH = /^\/dex\/([^/]+)/;

function load(): Selection {
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null');
    if (stored && typeof stored.dex === 'string') {
      return {
        game: typeof stored.game === 'string' ? stored.game : null,
        dex: stored.dex,
      };
    }
  } catch {
    // storage can be unavailable or hold junk; start fresh
  }
  return { game: null, dex: DEFAULT_DEX };
}

interface SelectionContextValue extends Selection {
  /** Pick a game, moving to its main Pokédex (or National when it has none) */
  chooseGame: (game: string | null, dex?: string) => Promise<void>;
  chooseDex: (dex: string) => void;
  /** Adopt a selection that arrived in a link, without moving anywhere */
  adopt: (selection: Partial<Selection>) => void;
  selectorOpen: boolean;
  openSelector: () => void;
  closeSelector: () => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>(load);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } catch {
      // the selection simply won't outlive a reload
    }
  }, [selection]);

  // opening /dex/:name (a link, back button, tab) makes that the selected dex
  const urlDex = DEX_PATH.exec(pathname)?.[1];
  useEffect(() => {
    if (urlDex) setSelection((current) => ({ ...current, dex: urlDex }));
  }, [urlDex]);

  // pages that put the choice in their address follow it when it changes
  const followInUrl = useCallback(
    (next: Selection) => {
      if (DEX_PATH.test(pathname)) {
        navigate(dexHref(next.dex));
      } else if (pathname === '/team' && next.game) {
        const params = new URLSearchParams(search);
        params.set('game', next.game);
        navigate({ search: params.toString() }, { replace: true });
      }
    },
    [pathname, search, navigate]
  );

  const value = useMemo<SelectionContextValue>(
    () => ({
      ...selection,
      chooseGame: async (game, dex) => {
        let nextDex = dex ?? DEFAULT_DEX;
        if (game && !dex) {
          try {
            const group = await queryClient.fetchQuery(
              apiQuery<VersionGroup>(`version-group/${game}`)
            );
            nextDex = group.pokedexes[0]?.name ?? DEFAULT_DEX;
          } catch {
            // keep National when the game's Pokédexes can't be loaded
          }
        }
        const next = { game, dex: nextDex };
        setSelection(next);
        followInUrl(next);
      },
      chooseDex: (dex) => {
        const next = { ...selection, dex };
        setSelection(next);
        followInUrl(next);
      },
      adopt: (partial) =>
        setSelection((current) => ({ ...current, ...partial })),
      selectorOpen,
      openSelector: () => setSelectorOpen(true),
      closeSelector: () => setSelectorOpen(false),
    }),
    [selection, selectorOpen, followInUrl, queryClient]
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used inside <SelectionProvider>');
  }
  return context;
}

/**
 * The Pokédex being browsed: the one in the address on a /dex page, otherwise
 * the selected one.
 */
export function useDexName() {
  const { pathname } = useLocation();
  const { dex } = useSelection();
  return DEX_PATH.exec(pathname)?.[1] ?? dex;
}
