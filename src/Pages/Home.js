import React from "react";
import { Link } from "react-router-dom";
import PokemonCard from "../Components/PokemonCard";

function Home(props) {
	const search = props.search;
	const [allPokemonData, setAllPokemonData] = React.useState([]);
	const [loadSize, setLoadSize] = React.useState(
		"https://pokeapi.co/api/v2/pokemon?limit=1"
	);

	const [limit, setLimit] = React.useState(20);

	React.useEffect(() => {
		async function getRequestSize() {
			const res = await fetch(loadSize);
			const data = await res.json();
			const size = data.count;
			loadSize !== size &&
				setLoadSize(`https://pokeapi.co/api/v2/pokemon?limit=${size}`);
		}
		async function getAllPokemonData() {
			getRequestSize();
			const res = await fetch(loadSize, { cache: "force-cache" });
			const data = await res.json();
			// Fix name strings
			const nameFixed = data.results.map((pokemon) => ({
				...pokemon,
				displayName:
					pokemon.name !== "ho-oh" // Special case Ho-Oh
						? capitaliseFirstNoHyphen(pokemon.name)
						: "Ho-Oh",
			}));

			setAllPokemonData(nameFixed);
		}

		getAllPokemonData();
	}, [loadSize]);

	React.useEffect(() => {
		setLimit(20);
	}, [search]);

	function renderPokemonCards(offset, limit) {
		function renderCard(pokemon) {
			return (
				<Link to={`/pokemon/${pokemon.name}`}>
					<PokemonCard
						pokemon={pokemon}
						capitaliseFirstNoHyphen={capitaliseFirstNoHyphen}
						key={pokemon.name}
					/>
				</Link>
			);
		}
		const results = search
			? allPokemonData // If search exists then filter allPokemonData array
					.filter((pokemon) =>
						pokemon.name
							.toLowerCase()
							.includes(search.toLowerCase())
					)
					.slice(offset, limit) // Limit results displayed
					.map((pokemon) => renderCard(pokemon))
			: [];

		return search
			? (results.length && results) || ( // if not empty, return the search results array, else render <p></p>
					<p className="p-10 text-center text-xl italic text-gray-500">
						Nothing Here...
					</p>
			  )
			: allPokemonData // Else paginate allPokemonData array
					.slice(offset, limit)
					.map((pokemon) => renderCard(pokemon));
	}

	function capitaliseFirstNoHyphen(input) {
		return input
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}

	window.onscroll = function () {
		if (
			window.innerHeight + window.pageYOffset >=
			document.body.offsetHeight
		) {
			setLimit(
				(prevLimit) =>
					prevLimit < allPokemonData.length && prevLimit + 3 // stop infinitely increasing render limit
			);
		}
	};

	return (
		<div>
			<div className="container my-12 mx-auto content-center">
				<div className="-mx-1 flex flex-wrap place-content-center sm:mx-0 lg:-mx-4">
					{renderPokemonCards(0, limit)}
				</div>
			</div>
		</div>
	);
}

export default Home;
