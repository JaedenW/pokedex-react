import React from 'react';
import Navigation from './Components/Navigation';
import PokemonCard from './Components/PokemonCard';

function App() {
	const [allPokemonData, setAllPokemonData] = React.useState([]);
	const [loadSize, setLoadSize] = React.useState(
		'https://pokeapi.co/api/v2/pokemon?limit=1'
	);
	const [search, setSearch] = React.useState('');
	const [offset, setOffset] = React.useState(0);
	const [limit, setLimit] = React.useState(20);

	async function getRequestSize() {
		const res = await fetch(loadSize);
		const data = await res.json();
		const size = data.count;
		loadSize !== size &&
			setLoadSize(`https://pokeapi.co/api/v2/pokemon?limit=${size}`);
	}

	async function getAllPokemon() {
		getRequestSize();
		const res = await fetch(loadSize, { cache: 'force-cache' });
		const data = await res.json();

		setAllPokemonData(data.results);
	}

	React.useEffect(() => {
		getAllPokemon();
	}, [loadSize]);

	React.useEffect(() => {
		setLimit(20);
	}, [search]);

	function renderPokemonCards(offset, limit) {
		function renderCard(pokemon) {
			return <PokemonCard pokemon={pokemon} key={pokemon.name} />;
		}

		return search
			? allPokemonData // If search exists then filter allPokemonData array
					.filter((pokemon) =>
						pokemon.name.includes(search.toLowerCase())
					)
					.slice(offset, limit) // Limit results displayed
					.map((pokemon) => renderCard(pokemon))
			: allPokemonData // Else paginate allPokemonData array
					.slice(offset, limit)
					.map((pokemon) => renderCard(pokemon));
	}

	window.onscroll = function () {
		if (
			window.innerHeight + window.pageYOffset >
			document.body.offsetHeight
		) {
			setLimit(
				(prevLimit) =>
					prevLimit < allPokemonData.length && prevLimit + 3 // stop infinitely increasing render limit
			);
		}
	};

	return (
		<div className="bg-[#ECF0F3]">
			<div className="sticky top-0 z-50">
				<Navigation search={search} setSearch={setSearch} />
			</div>
			<div className="container content-center my-12 mx-auto">
				<div className="flex flex-wrap -mx-1 lg:-mx-4  place-content-center">
					{renderPokemonCards(offset, limit)}
				</div>
			</div>
		</div>
	);
}

export default App;
