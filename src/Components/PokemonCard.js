import React from "react";
import Type from "./Type";

const PokemonCard = (props) => {
	const { displayName, url } = props.pokemon;
	const [pokemonData, setPokemonData] = React.useState({
		sprites: {},
		types: [],
	});

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
			<div className=" m-4 w-[16rem] items-center overflow-hidden rounded-lg bg-gray-50 shadow-sm transition duration-100 hover:scale-105 hover:shadow-md">
				<img
					className="m-auto block h-auto w-[60%]"
					src={sprites.front_default}
					alt={displayName}
				/>
				<div className="text-center">
					<h1 className="text-medium m-3 text-2xl">{displayName}</h1>
					{types.map((type) => (
						<Type
							type={type.type}
							capitaliseFirstNoHyphen={
								props.capitaliseFirstNoHyphen
							}
							key={type.slot}
						/>
					))}
				</div>
				<footer className="2 border bg-gray-200 p-1.5 text-center text-lg text-gray-600">
					# {("000" + id).slice(-3)} {/* Zerofilled ID */}
				</footer>
			</div>
		)
	);
};

export default PokemonCard;
