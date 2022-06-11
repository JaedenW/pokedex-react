import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { PokedexContext } from './PokedexContext';
import Navbar from './Components/Navbar';
import RegionSelector from './Components/RegionSelector';
import ScrollToTop from './Components/ScrollToTop';
import ProgressIndicator from './Components/ProgressIndicator';
import './index.css';

const Home = React.lazy(() => import('./Pages/Home'));
const Pokemon = React.lazy(() => import('./Pages/Pokemon'));
const TypePage = React.lazy(() => import('./Pages/TypePage'));

function App() {
  const [currentRegion, setCurrentRegion] = React.useState({
    name: 'kanto',
    url: 'https://pokeapi.co/api/v2/region/1/',
  });

  const [currentPokedex, setCurrentPokedex] = React.useState({
    name: 'kanto',
    url: 'https://pokeapi.co/api/v2/pokedex/2/',
  });

  const [search, setSearch] = React.useState('');
  const [toggleSidebar, setToggleSidebar] = React.useState(false);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  });

  return (
    <PokedexContext.Provider
      value={{
        currentRegion,
        setCurrentRegion,
        currentPokedex,
        setCurrentPokedex,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="flex h-screen pt-16 sm:pt-10">
            <Navbar search={search} setSearch={setSearch} />
            <React.Suspense
              fallback={
                <div
                  className={`fixed -mt-6 h-full w-[8rem] bg-[#FFCC00] pt-6 shadow-2xl sm:relative sm:-mt-0 sm:w-[10rem] sm:shadow-none`}
                />
              }
            >
              <RegionSelector
                toggleSidebar={toggleSidebar}
                setToggleSidebar={setToggleSidebar}
              />
            </React.Suspense>
            <React.Suspense fallback={<ProgressIndicator />}>
              <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-scroll">
                  <Routes>
                    <Route path="/" element={<Home search={search} />} />
                    <Route index element={<Home search={search} />} />
                    <Route
                      path="pokemon/:name"
                      element={
                        <div>
                          <ScrollToTop />
                          <Pokemon />
                        </div>
                      }
                    />
                    <Route
                      path="type/:typeName"
                      element={
                        <div>
                          <ScrollToTop />
                          <TypePage />
                        </div>
                      }
                    />
                    <Route
                      path="/pokedex-react"
                      element={<Navigate to="/" />}
                    />
                  </Routes>
                </div>
              </div>
            </React.Suspense>
          </div>
        </Router>
      </QueryClientProvider>
    </PokedexContext.Provider>
  );
}

export default App;
