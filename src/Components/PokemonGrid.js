import React from 'react';
import ProgressIndicator from './ProgressIndicator';
import usePokemonData from '../Hooks/usePokemonData';

const PokemonCard = React.lazy(() => import('./PokemonCard'));

function PokemonGrid({ search }) {
  const { allData } = usePokemonData();
  const [isPending, startTransition] = React.useTransition();
  const [toRender, setToRender] = React.useState([]);
  const [limit, setLimit] = React.useState(20);

  React.useEffect(() => setLimit(40), [search]);

  React.useEffect(
    () =>
      startTransition(() =>
        setToRender(
          allData?.results
            .filter((pokemon) =>
              pokemon.name.toLowerCase().includes(search.toLowerCase())
            )
            .slice(0, limit)
        )
      ),
    [limit, allData, search]
  );

  window.onscroll = function () {
    function paginate() {
      setLimit((prevLimit) => prevLimit + 2);
      console.log('called!');
    }
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      throttle(paginate, 1000);
    }
  };

  function throttle(callbackFn, delay) {
    let wait = false;
    if (!wait) {
      callbackFn();
      wait = true;
      setTimeout(() => {
        wait = false;
      }, delay);
    }
  }

  return (
    <div className="container my-12 mx-auto w-full content-center">
      {isPending && <ProgressIndicator />}
      <div className="-mx-1 flex flex-wrap place-content-center sm:mx-0 lg:-mx-7">
        {toRender?.map((pokemon) => (
          <PokemonCard pokemon={pokemon} key={`${pokemon.name}Searched`} />
        ))}
      </div>
    </div>
  );
}

export default PokemonGrid;
