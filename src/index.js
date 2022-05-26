import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./Pages/Home";
import Test from "./Pages/Test";
import Navigation from "./Components/Navigation";
import Pokemon from "./Pages/Pokemon";

export default function App() {
  const [search, setSearch] = React.useState("");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigation search={search} setSearch={setSearch} />}
        >
          <Route index element={<Home search={search} />} />
          <Route path="pokemon/:name" element={<Pokemon />} />
          <Route path="test" element={<Test />} />
        </Route>
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
