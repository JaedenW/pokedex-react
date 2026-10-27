import React from 'react';
import { PokedexContext } from '../Utils/PokedexContext';

function Home({ children, scrollTop }) {
  const { currentPokedex } = React.useContext(PokedexContext);

  React.useEffect(() => {
    scrollTop();
  }, [currentPokedex]);

  return <>{children}</>;
}

export default Home;
