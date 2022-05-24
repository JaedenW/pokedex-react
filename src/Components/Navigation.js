import React from 'react';
import Pokeball from '../Images/pokeball.png';

function Navigation(props) {
	const { search, setSearch } = props;

	function handleSearch(event) {
		setSearch(event.target.value);
	}

	return (
		<nav className="relative w-full flex flex-wrap items-center justify-between py-3.5 bg-gray-100 text-gray-500 hover:text-gray-700 focus:text-gray-700 shadow-md">
			<div className="container-fluid w-full flex flex-wrap items-center px-3">
				<div className="flex max-w-lg w-[90%] items-center text-gray-900 hover:text-gray-900 focus:text-gray-900 mr-1">
					<img
						className="inline-flex w-9 mx-2"
						src={Pokeball}
						alt="Pokeball"
					/>
					<h1 className="inline-flex font-medium text-xl mr-10">
						Pokédex
					</h1>
					<input
						type="text"
						id="search-navbar"
						className="inline-flex p-2 ml-1 w-full  placeholder-gray-500 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Search..."
						onChange={handleSearch}
						value={search}
					/>
				</div>
			</div>
		</nav>
	);
}

export default Navigation;
