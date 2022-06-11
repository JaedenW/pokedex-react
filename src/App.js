import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PokedexContext } from './Utils/PokedexContext';
import Navbar from './Components/Navbar';
import RegionSelector from './Components/RegionSelector';
import ProgressIndicator from './Components/ProgressIndicator';
import './index.css';

const Home = React.lazy(() => import('./Pages/Home'));
const Pokemon = React.lazy(() => import('./Pages/Pokemon'));
const TypePage = React.lazy(() => import('./Pages/TypePage'));

function App() {
  const [search, setSearch] = React.useState('');
  const [toggleSidebar, setToggleSidebar] = React.useState(false);
  const { willScroll, setWillScroll } = React.useContext(PokedexContext);
  const topRef = React.useRef();

  React.useEffect(() => {
    willScroll &&
      topRef?.current?.scrollTop &&
      (() => (topRef.current.scrollTop = 0))();
    setWillScroll(false);
  }, [willScroll]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar search={search} setSearch={setSearch} />
      <React.Suspense
        fallback={
          <div
            className={`fixed h-full w-0 bg-[#FFCC00] pt-6 shadow-2xl sm:relative sm:-mt-0 sm:w-[10rem] sm:shadow-none`}
          />
        }
      >
        <RegionSelector
          toggleSidebar={toggleSidebar}
          setToggleSidebar={setToggleSidebar}
        />
      </React.Suspense>
      <React.Suspense fallback={<ProgressIndicator />}>
        <div className="flex flex-1">
          <div
            ref={topRef}
            className="flex-1 overflow-y-scroll scroll-auto pt-16 sm:pt-10"
          >
            <Routes>
              <Route path="/" element={<Home search={search} />} />
              <Route index element={<Home search={search} />} />
              <Route path="pokemon/:name" element={<Pokemon />} />
              <Route path="type/:typeName" element={<TypePage />} />
              <Route path="/pokedex-react" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </React.Suspense>
    </div>
  );
}

export default App;
