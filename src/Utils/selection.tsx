import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
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
  /** Make a Pokédex that has loaded from a link the selected one */
  adoptDex: (dex: string) => void;
  selectorOpen: boolean;
  openSelector: () => void;
  closeSelector: () => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>(load);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } catch {
      // the selection simply won't outlive a reload
    }
  }, [selection]);

  // read at the moment of use: choosing a game waits for its details
  const latestLocation = useRef(location);
  useLayoutEffect(() => {
    latestLocation.current = location;
  }, [location]);
  const latestChoice = useRef(0);

  const adoptDex = useCallback(
    (dex: string) =>
      setSelection((current) =>
        current.dex === dex ? current : { ...current, dex }
      ),
    []
  );

  // pages that put the choice in their address follow it when it changes
  const followInUrl = useCallback(
    (next: Selection) => {
      const { pathname, search } = latestLocation.current;
      if (DEX_PATH.test(pathname)) {
        navigate(dexHref(next.dex));
      } else if (pathname === '/team') {
        const params = new URLSearchParams(search);
        if (next.game) params.set('game', next.game);
        else params.delete('game');
        navigate({ search: params.toString() }, { replace: true });
      }
    },
    [navigate]
  );

  const value = useMemo<SelectionContextValue>(
    () => ({
      ...selection,
      chooseGame: async (game, dex) => {
        const choice = ++latestChoice.current;
        let nextDex = dex ?? DEFAULT_DEX;
        if (game && !dex) {
          try {
            const group = await queryClient.fetchQuery(
              apiQuery<VersionGroup>(`version-group/${game}`)
            );
            nextDex = group.pokedexes[0]?.name ?? DEFAULT_DEX;
          } catch {
            return; // a game that can't be loaded must not become the selection
          }
        }
        if (choice !== latestChoice.current) return; // a newer choice won
        const next = { game, dex: nextDex };
        setSelection(next);
        followInUrl(next);
      },
      chooseDex: (dex) => {
        const next = { ...selection, dex };
        setSelection(next);
        followInUrl(next);
      },
      adoptDex,
      selectorOpen,
      openSelector: () => setSelectorOpen(true),
      closeSelector: () => setSelectorOpen(false),
    }),
    [selection, selectorOpen, followInUrl, adoptDex, queryClient]
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
