import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Test from "./Pages/Test";
import Navigation from "./Components/Navigation";

export default function Router() {
  const [search, setSearch] = React.useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigation search={search} setSearch={setSearch} />}
        >
          <Route index element={<App search={search} />} />
          <Route path="test" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
