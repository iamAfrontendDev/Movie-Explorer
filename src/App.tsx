import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { lazy,Suspense } from "react";
const MovieDetails=lazy(()=> import('./pages/MovieDetails'))
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={
        <Suspense fallback={<h2>Loading...</h2>}>
        <MovieDetails />
        </Suspense>
        } />
    </Routes>
  );
}

export default App;
