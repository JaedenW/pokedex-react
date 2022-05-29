import React from 'react';
import Type from './Type';
import { Link } from 'react-router-dom';
import useThisPokemon from '../Hooks/useThisPokemon';

const PokemonCard = ({ pokemon, getDisplayName }) => {
	const { name, url } = pokemon;
	const { data } = useThisPokemon(url);
	const displayName = getDisplayName(name);
	const pokemonData = { name, url, displayName, ...data };
	const { sprites, types, id } = pokemonData;
	let showCard = false;

	return (
		id < 10000 && (
			<Link
				to={`/pokemon/${name}`}
				state={{ pokemonData }}
				style={{ hidden: `${showCard}` }}
			>
				<div className=" m-4 w-[16rem] items-center overflow-hidden rounded-lg bg-gray-50 shadow-sm transition duration-100 hover:scale-105 hover:shadow-md">
					<img
						onLoad={() => (showCard = true)}
						className="m-auto block h-auto w-[60%]"
						src={sprites.front_default}
						alt={displayName}
					/>
					<div className="text-center">
						<h1 className="text-medium m-3 text-2xl">{displayName}</h1>
						{types.map((type) => (
							<Type type={type.type} key={type.slot} />
						))}
					</div>
					<footer className="2 border bg-gray-200 p-1.5 text-center text-lg text-gray-600">
						# {('000' + id).slice(-3)} {/* Zerofilled ID */}
					</footer>
				</div>
			</Link>
		)
	);
};

export default PokemonCard;
