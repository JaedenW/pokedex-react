import React from 'react';
import Pokeball from '../Images/pokeball.png';
import { Outlet, Link, useNavigate } from 'react-router-dom';

function Navbar({ search, setSearch, scrollRef }) {
  const navigate = useNavigate();

  function handleClick() {
    setSearch('');
    setTimeout(
      () => scrollRef.current && (() => (scrollRef.current.scrollTop = 0))(),
      500
    );
  }

  function handleEnterKey(event) {
    if (event.code === 'Enter') {
      event.target.blur();
      navigate('/');
    }
  }

  return (
    <div className="fixed top-0 z-30 h-[4rem] w-full bg-[#0A285F] shadow-lg">
      <nav className="flex h-full w-screen items-center text-gray-600 hover:text-gray-800 focus:text-gray-800">
        <div className="container-fluid inline-flex h-full w-full items-center px-3 shadow-xl">
          <Link
            className="z-50 flex h-full items-center"
            to="/"
            onClick={handleClick}
          >
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
        </div>
        <div className="inline-flex w-full md:absolute md:flex">
          <input
            type="text"
            id="search-navbar"
            className="z-50 mr-2 w-full rounded-lg border border-black bg-[#DFDFDF] py-2 pl-4 font-sans placeholder-gray-500 shadow-sm hover:border-[#FB1B1B] md:mx-auto md:w-[40%] xl:w-[30%]"
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
