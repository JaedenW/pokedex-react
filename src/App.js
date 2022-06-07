import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './index.css';
import Navbar from './Components/Navbar';
import ScrollToTop from './Components/ScrollToTop';
import { QueryClient, QueryClientProvider } from 'react-query';
import ProgressIndicator from './Components/ProgressIndicator';

const Home = React.lazy(() => import('./Pages/Home'));
const Pokemon = React.lazy(() => import('./Pages/Pokemon'));
const TypePage = React.lazy(() => import('./Pages/TypePage'));

function App() {
  const [search, setSearch] = React.useState('');
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar className="m-[20%]" search={search} setSearch={setSearch} />
        <React.Suspense fallback={<ProgressIndicator />}>
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
            <Route path="/pokedex-react" element={<Navigate to="/" />} />
          </Routes>
        </React.Suspense>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
