import React from 'react';
import Pokeball from '../Images/pokeball.png';
import { Outlet, Link, useNavigate } from 'react-router-dom';

function Navbar({ search, setSearch }) {
  const navigate = useNavigate();

  function handleEnterKey(event) {
    if (event.code === 'Enter') {
      event.target.blur();
      navigate('/');
    }
  }

  return (
    <div className="fixed top-0 z-30 h-[3.9rem] w-full shadow-lg">
      <nav className="relative flex h-full w-full flex-wrap items-center justify-between text-gray-600 hover:text-gray-800 focus:text-gray-800">
        <div className="container-fluid z-40 flex w-full flex-wrap items-center bg-[#0A285F] px-3 py-3.5 shadow-xl">
          <Link to="/" onClick={() => setSearch('')}>
            <div className="mr-1 flex items-center text-white">
              <img
                className="mx-2 inline-flex w-9"
                src={Pokeball}
                alt="Pokeball"
              />
              <h1 className="pokefont mr-2 mt-0.5 inline-flex text-xl font-bold ">
                Pokédex
              </h1>
            </div>
          </Link>
          <input
            type="text"
            id="search-navbar"
            className="absolute right-3 w-[50%] max-w-[50%] rounded-lg border border-black bg-[#DFDFDF] py-2 pl-4 font-sans placeholder-gray-500 shadow-sm hover:border-[#FB1B1B] sm:max-w-full md:left-0 md:mx-auto md:w-[40%] lg:right-0 xl:w-[30%]"
            placeholder="Search..."
            enterKeyHint="search"
            onChange={(event) => setSearch(event.target?.value)}
            onKeyUp={handleEnterKey}
            value={search}
          />
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default Navbar;
