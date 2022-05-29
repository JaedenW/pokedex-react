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
    return allData ? (
      allData?.results
        .filter((pokemon) =>
          pokemon.name.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 40)
        .map((pokemon) => (
          <PokemonCard
            pokemon={pokemon}
            getDisplayName={getDisplayName}
            key={pokemon.name}
          />
        ))
    ) : (
      <>
        {data.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.results.map((pokemon) => (
              <PokemonCard
                pokemon={pokemon}
                getDisplayName={getDisplayName}
                key={pokemon.name}
              />
            ))}
          </React.Fragment>
        ))}
      </>
    );
  }

  function getDisplayName(name) {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
      <div className="container my-12 mx-auto content-center">
        <div className="-mx-1 flex flex-wrap place-content-center sm:mx-0 lg:-mx-4">
          {status === 'success' && renderPokemonCards()}
        </div>
      </div>
    </div>
  );
}

export default Home;
