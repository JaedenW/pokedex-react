import React from 'react';
import './App.css';
import { Container, Row } from 'react-bootstrap';
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

	function renderPokemonCards(offset, limit) {
		function renderCard(pokemon) {
			return <PokemonCard pokemon={pokemon} key={pokemon.name} />;
		}

		return search
			? allPokemonData // If search exists then filter allPokemonData array
					.filter((pokemon) =>
						pokemon.name.includes(search.toLowerCase())
					)
					.slice(0, 20) // Limit results displayed
					.map((pokemon) => renderCard(pokemon))
			: allPokemonData // Else paginate allPokemonData array
					.slice(offset, limit)
					.map((pokemon) => renderCard(pokemon));
	}

	window.onscroll = function () {
		if (
			window.innerHeight + document.documentElement.scrollTop ===
			document.documentElement.offsetHeight
		) {
			setLimit((prevLimit) => prevLimit + 20);
		}
	};

	return (
		<div className="App">
			<Navigation search={search} setSearch={setSearch} />
			<Container fluid="md">
				<Row>{renderPokemonCards(offset, limit)}</Row>
			</Container>
		</div>
	);
}

export default App;
