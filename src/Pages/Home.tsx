import React from 'react';
import { usePokedex } from '../Utils/PokedexContext';

function Home({
  children,
  scrollTop,
}: {
  children: React.ReactNode;
  scrollTop: () => void;
}) {
  const { currentPokedex } = usePokedex();

  React.useEffect(() => {
    scrollTop();
  }, [currentPokedex]);

  return <>{children}</>;
}

export default Home;
