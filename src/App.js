import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './index.css';
import Home from './Pages/Home';
import Navbar from './Components/Navbar';
import Pokemon from './Pages/Pokemon';
import { QueryClient, QueryClientProvider } from 'react-query';

function App() {
  const [search, setSearch] = React.useState('');
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar className="m-[20%]" search={search} setSearch={setSearch} />
        <Routes>
          <Route path="/" element={<Home search={search} />} />
          <Route index element={<Home search={search} />} />
          <Route path="pokemon/:name" element={<Pokemon />} />
          <Route path="/pokedex-react" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
