import React from "react";
import { useParams, Outlet } from "react-router-dom";

function Pokemon(props) {
  const params = useParams();
  const name = params.id;
  return (
    <div>
      <h1>{name}</h1>
      <Outlet />
    </div>
  );
}

export default Pokemon;
