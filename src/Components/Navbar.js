import React from 'react';
import Pokeball from '../Images/pokeball.png';
import { Outlet, Link, useNavigate } from 'react-router-dom';

function Navbar({ search, setSearch }) {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 z-50 w-full">
      <nav className="relative flex w-full flex-wrap items-center justify-between bg-[#0A285F] py-3.5 text-gray-500 shadow-md hover:text-gray-100 focus:text-gray-100">
        <div className="container-fluid flex w-full flex-wrap items-center px-3">
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
            className="absolute right-2 ml-[30rem] w-[60%] rounded-lg border border-black bg-[#e9e7db] pt-2.5 pb-2 pl-4 font-sans placeholder-gray-500 shadow-sm hover:border-[#FB1B1B] lg:left-0 lg:right-0 lg:mx-auto lg:w-[40%] xl:w-[30%]"
            placeholder="Search..."
            onChange={(event) => setSearch(event.target?.value)}
            onClick={() => navigate('/')}
            value={search}
          />
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default Navbar;
