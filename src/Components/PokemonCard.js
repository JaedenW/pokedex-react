import React from "react";
import Type from "./Type";

const PokemonCard = (props) => {
  const { name, url } = props.pokemon;
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
      <div className=" bg-gray-50 overflow-hidden items-center rounded-lg shadow-sm m-4 w-[16rem] transition duration-100 hover:scale-105 hover:shadow-md">
        <img
          className="block m-auto h-auto w-[60%]"
          src={sprites.front_default}
          alt={name}
        />
        <div className="text-center">
          <h1 className="text-medium text-2xl m-3">{name}</h1>
          {types.map((type) => (
            <Type
              type={type.type}
              capitaliseFirstNoHyphen={props.capitaliseFirstNoHyphen}
              key={type.slot}
            />
          ))}
        </div>
        <footer className="text-center text-lg text-gray-600 border 2 bg-gray-200 p-1.5">
          # {("000" + id).slice(-3)} {/* Zerofilled ID */}
        </footer>
      </div>
    )
  );
};

export default PokemonCard;
