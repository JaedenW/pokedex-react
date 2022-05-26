import React from "react";
import { useParams, Outlet } from "react-router-dom";

function Pokemon(props) {
	const params = useParams();
	const name = params.name;
	const [thisPokemon, setThisPokemon] = React.useState({});

	React.useEffect(() => {
		async function getThisPokemon() {
			const res = await fetch(
				`https://pokeapi.co/api/v2/pokemon/${name}`
			);
			const data = await res.json();
			setThisPokemon(data);
		}
		getThisPokemon();
	}, [name]);

	console.log(thisPokemon);

	return (
		<div>
			<h1>{name}</h1>
			<Outlet />
		</div>
	);
}

export default Pokemon;
