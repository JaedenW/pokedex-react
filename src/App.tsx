import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import Navbar from './Components/Navbar';
import BottomTabs from './Components/BottomTabs';
import ErrorBoundary from './Components/ErrorBoundary';
import ProgressIndicator from './Components/ProgressIndicator';
import SearchPalette from './Components/SearchPalette';
import { Loading } from './Components/ui';
import { useScrollRestoration } from './Hooks/useScrollRestoration';
import { GameSelectorModal } from './Components/GameSelector';
import { dexHref } from './Utils/dex';
import { useSelection } from './Utils/selection';
import './index.css';

const DexPage = React.lazy(() => import('./Pages/DexPage'));
const PokemonPage = React.lazy(() => import('./Pages/PokemonPage'));
const TypePage = React.lazy(() => import('./Pages/TypePage'));
const TypesPage = React.lazy(() => import('./Pages/TypesPage'));
const MovesPage = React.lazy(() => import('./Pages/MovesPage'));
const MovePage = React.lazy(() => import('./Pages/MovePage'));
const AbilitiesPage = React.lazy(() => import('./Pages/AbilitiesPage'));
const AbilityPage = React.lazy(() => import('./Pages/AbilityPage'));
const ItemsPage = React.lazy(() => import('./Pages/ItemsPage'));
const ItemPage = React.lazy(() => import('./Pages/ItemPage'));
const TeamPage = React.lazy(() => import('./Pages/TeamPage'));
const NotFoundPage = React.lazy(() => import('./Pages/NotFoundPage'));

function App() {
  const { pathname } = useLocation();
  const { dex } = useSelection();
  const scrollRef = React.useRef<HTMLElement>(null);

  useScrollRestoration(scrollRef);

  return (
    <>
      <Navbar />
      <main
        ref={scrollRef}
        data-scroll-root
        className="fixed inset-x-0 top-(--header-h) bottom-(--tabbar-h) overflow-y-scroll overscroll-contain lg:bottom-0"
      >
        <ErrorBoundary resetKey={pathname}>
          <React.Suspense
            fallback={
              <>
                <ProgressIndicator />
                <Loading className="h-[60vh]" />
              </>
            }
          >
            <Routes>
              <Route
                path="/"
                element={<Navigate to={dexHref(dex)} replace />}
              />
              <Route path="/dex/:pokedex" element={<DexPage />} />
              <Route path="/pokemon/:name" element={<PokemonPage />} />
              <Route path="/types" element={<TypesPage />} />
              <Route path="/type/:name" element={<TypePage />} />
              <Route path="/moves" element={<MovesPage />} />
              <Route path="/move/:name" element={<MovePage />} />
              <Route path="/abilities" element={<AbilitiesPage />} />
              <Route path="/ability/:name" element={<AbilityPage />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/item/:name" element={<ItemPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </React.Suspense>
        </ErrorBoundary>
      </main>
      <BottomTabs />
      <SearchPalette />
      <GameSelectorModal />
    </>
  );
}

export default App;
