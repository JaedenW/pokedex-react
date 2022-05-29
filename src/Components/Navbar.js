import React from 'react';
import Pokeball from '../Images/pokeball.png';
import { Outlet, Link } from 'react-router-dom';

function Navbar(props) {
	const { search, setSearch } = props;

	function handleSearch(event) {
		setSearch(event.target.value);
	}

	return (
		<div className="fixed top-0 z-50 w-full">
			<nav className="relative flex w-full flex-wrap items-center justify-between bg-gray-100 py-3.5 text-gray-500 shadow-md hover:text-gray-700 focus:text-gray-700">
				<div className="container-fluid flex w-full flex-wrap items-center px-3">
					<Link to="/">
						<div className="mr-1 flex items-center text-gray-900 hover:text-gray-900 focus:text-gray-900">
							<img
								className="mx-2 inline-flex w-9"
								src={Pokeball}
								alt="Pokeball"
							/>
							<h1 className="mr-2 inline-flex text-xl font-medium">
								Pokédex
							</h1>
						</div>
					</Link>
					<input
						type="text"
						id="search-navbar"
						className="mr[1rem] absolute ml-[12rem] w-[50%] rounded-lg border border-gray-300 bg-gray-200 p-2 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 md:left-0 md:right-0 md:mx-auto lg:w-[30%]"
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

export default Navbar;
