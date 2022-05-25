import React from "react";
import Pokeball from "../Images/pokeball.png";
import { Outlet, Link } from "react-router-dom";

function Navigation(props) {
  const { search, setSearch } = props;

  function handleSearch(event) {
    setSearch(event.target.value);
  }

  return (
    <div className="sticky top-0 z-50">
      <nav className="relative w-full flex flex-wrap items-center justify-between py-3.5 bg-gray-100 text-gray-500 hover:text-gray-700 focus:text-gray-700 shadow-md">
        <div className="container-fluid w-full flex flex-wrap items-center px-3">
          <Link to="/">
            <div className="flex items-center text-gray-900 hover:text-gray-900 focus:text-gray-900 mr-1">
              <img
                className="inline-flex w-9 mx-2"
                src={Pokeball}
                alt="Pokeball"
              />
              <h1 className="inline-flex font-medium text-xl mr-2">Pokédex</h1>
            </div>
          </Link>
          <Link to="/test">
            <h1 className="inline-flex text-gray-900 font-medium text-xl mr-2">
              Test
            </h1>
          </Link>
          <input
            type="text"
            id="search-navbar"
            className="absolute md:left-0 md:right-0 p-2 md:mx-auto ml-[12rem] mr[1rem] w-[50%] lg:w-[30%] placeholder-gray-500 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search..."
            onChange={handleSearch}
            value={search}
          />
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default Navigation;
