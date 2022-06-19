import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import ProgressIndicator from './Components/ProgressIndicator';
import './index.css';

const RegionSelector = React.lazy(() => import('./Components/RegionSelector'));
const Home = React.lazy(() => import('./Pages/Home'));
const Pokemon = React.lazy(() => import('./Pages/Pokemon'));
const TypePage = React.lazy(() => import('./Pages/TypePage'));
const PokemonGrid = React.lazy(() => import('./Components/PokemonGrid'));

function App() {
  const [search, setSearch] = React.useState('');
  const [toggleSidebar, setToggleSidebar] = React.useState(false);
  const { pathname } = useLocation();
  const scrollRef = React.useRef();
  const [reachedBottom, setReachedBottom] = React.useState(false);

  function onScroll() {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      scrollTop + clientHeight === scrollHeight && setReachedBottom(true);
    }
  }

  function scrollTop() {
    setTimeout(
      () => scrollRef.current && (() => (scrollRef.current.scrollTop = 0))(),
      200
    );
  }

  React.useEffect(() => {
    setToggleSidebar(false);
  }, [pathname]);

  return (
    <div className="h-screen w-screen overflow-hidden py-20 sm:py-14">
      <Navbar search={search} setSearch={setSearch} scrollTop={scrollTop} />
      <React.Suspense
        fallback={
          <div
            className={`fixed h-full w-0 bg-[#FFCC00] pt-6 shadow-2xl sm:relative sm:w-[10rem] sm:shadow-none`}
          />
        }
      >
        <RegionSelector
          toggleSidebar={toggleSidebar}
          setToggleSidebar={setToggleSidebar}
        />
      </React.Suspense>
      <React.Suspense fallback={<ProgressIndicator />}>
        <div className="flex h-screen flex-1 overscroll-none">
          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="h-full flex-1 overflow-y-scroll scroll-auto sm:pl-[10rem]"
          >
            <Routes>
              <Route
                path="/"
                element={
                  <Home scrollTop={scrollTop}>
                    <PokemonGrid
                      search={search}
                      reachedBottom={reachedBottom}
                      setReachedBottom={setReachedBottom}
                    />
                  </Home>
                }
              />
              <Route
                index
                element={
                  <Home scrollTop={scrollTop}>
                    <PokemonGrid
                      search={search}
                      reachedBottom={reachedBottom}
                      setReachedBottom={setReachedBottom}
                    />
                  </Home>
                }
              />
              <Route
                path="pokemon/:name"
                element={<Pokemon scrollTop={scrollTop} />}
              />
              <Route
                path="type/:typeName"
                element={
                  <TypePage
                    scrollTop={scrollTop}
                    reachedBottom={reachedBottom}
                    setReachedBottom={setReachedBottom}
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </React.Suspense>
    </div>
  );
}

export default App;
