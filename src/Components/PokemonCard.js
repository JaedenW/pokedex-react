import React from 'react';
import Type from './Type';

const PokemonCard = (props) => {
	const { name, url } = props.pokemon;
	const [pokemonData, setPokemonData] = React.useState({
		sprites: {},
		types: [],
	});

	function capitaliseFirst(input) {
		return input.charAt(0).toUpperCase() + input.slice(1);
	}

	React.useEffect(() => {
		async function getPokemonData() {
			const res = await fetch(url);
			const data = await res.json();
			setPokemonData(data);
		}
		getPokemonData();
	}, [url]);

	const { sprites, types, id } = pokemonData;

	return (
		pokemonData.id < 10000 && (
			<div className=" bg-gray-50 overflow-hidden items-center rounded-lg shadow-md m-3 w-[15rem]">
				<img
					className="block m-auto h-auto w-[50%]"
					src={sprites.front_default}
					alt={name}
				/>
				<div className="text-center">
					<h1 className="text-medium text-xl m-2">
						{capitaliseFirst(name)}
					</h1>
					{types.map((type) => (
						<Type
							type={type.type}
							capitaliseFirst={capitaliseFirst}
							key={type.slot}
						/>
					))}
				</div>
				<footer className="text-center text-gray-600 border 2 bg-gray-200 p-1.5">
					ID: {id}
				</footer>
			</div>
		)
	);
};

export default PokemonCard;
