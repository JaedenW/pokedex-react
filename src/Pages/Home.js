import React from 'react';
import PokemonCard from '../Components/PokemonCard';
import usePokemonData from '../Hooks/usePokemonData';

function Home({ search }) {
  const [isSearching, setIsSearching] = React.useState(false);
  const { data, status, fetchNextPage, hasNextPage, allData } =
    usePokemonData(isSearching);

  React.useEffect(() => {
    setIsSearching(search.length > 0);
  }, [search]);

  function renderPokemonCards() {
    if (allData) {
      const filtered = allData?.results.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      );

      if (filtered.length > 0) {
        return filtered
          .slice(0, 40)
          .map((pokemon) => (
            <PokemonCard pokemon={pokemon} key={`${pokemon.name}Searched`} />
          ));
      } else {
        return <h1 className="mt-20 text-xl text-gray-700">Nothing here...</h1>;
      }
    } else {
      return (
        <>
          {data.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.results.map((pokemon) => (
                <PokemonCard
                  pokemon={pokemon}
                  key={`${pokemon.name}Paginated`}
                />
              ))}
            </React.Fragment>
          ))}
        </>
      );
    }
  }

  function throttle(callbackFn, limit) {
    let wait = false;
    if (!wait) {
      callbackFn();
      wait = true;
      setTimeout(() => {
        wait = false;
      }, limit);
    }
  }

  window.onscroll = function () {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      hasNextPage && throttle(fetchNextPage, 1000);
    }
  };

  return (
    <div>
      <div className="container my-12 mx-auto w-full content-center">
        <div className="-mx-1 flex flex-wrap place-content-center sm:mx-0 lg:-mx-7">
          {status === 'success' && renderPokemonCards()}
        </div>
      </div>
    </div>
  );
}

export default Home;
