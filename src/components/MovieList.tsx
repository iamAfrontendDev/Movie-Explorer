import type { Genre, Movie } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieListProps {
  popularMovies: Movie[];
  genreMap: Record<number, string>;
}

export default function MovieList({ popularMovies, genreMap }: MovieListProps) {
  return (
    <>
      <h1>Movie List</h1>
      {popularMovies.map((popularMovieCard) => (
        <MovieCard popularMovieCard={popularMovieCard} genreMap={genreMap} />
      ))}
    </>
  );
}
