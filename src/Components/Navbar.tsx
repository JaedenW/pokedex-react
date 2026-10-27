import React from 'react';
import Pokeball from '../Images/pokeball.png';
import { Link, useNavigate } from 'react-router';

interface NavbarProps {
  search: string;
  setSearch: (search: string) => void;
  scrollTop: () => void;
}

function Navbar({ search, setSearch, scrollTop }: NavbarProps) {
  const navigate = useNavigate();

  function handleClick() {
    setSearch('');
    scrollTop();
  }

  function handleEnterKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.code === 'Enter') {
      event.currentTarget.blur();
      navigate('/');
    }
  }

  return (
    <div className="fixed top-0 z-30 h-16 w-full bg-[#0A285F] shadow-lg">
      <nav className="flex h-full w-screen items-center text-gray-600 hover:text-gray-800">
        <div className="inline-flex h-full w-full items-center px-3 shadow-xl">
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
              <h1 className="mt-0.5 mr-2 inline-flex text-xl font-bold">
                Pokédex
              </h1>
            </div>
          </Link>
        </div>
        <div className="inline-flex w-full lg:absolute">
          <input
            type="text"
            id="search-navbar"
            className="z-50 mr-2 w-full rounded-lg border border-black bg-[#DFDFDF] py-2 pl-4 font-sans placeholder-gray-500 shadow-xs hover:border-[#FB1B1B] lg:mx-auto lg:w-[40%] xl:w-[30%]"
            placeholder="Search..."
            enterKeyHint="search"
            onChange={(event) => setSearch(event.target.value)}
            onKeyUp={handleEnterKey}
            value={search}
          />
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
