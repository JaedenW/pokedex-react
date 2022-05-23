import React from 'react';
import { Card } from 'react-bootstrap';
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
			<Card className="text-center m-2" style={{ width: '16rem' }}>
				<Card.Img
					variant="top"
					src={sprites.front_default}
					alt={name}
				/>
				<Card.Body>
					<Card.Title>{capitaliseFirst(name)}</Card.Title>
					{types.map((type) => (
						<Type
							type={type.type}
							capitaliseFirst={capitaliseFirst}
							key={type.slot}
						/>
					))}
				</Card.Body>
				<Card.Footer className="text-muted" as="h6">
					ID: {id}
				</Card.Footer>
			</Card>
		)
	);
};

export default PokemonCard;
