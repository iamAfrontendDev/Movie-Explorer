import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";
import "./MovieList.css";

interface MovieListProps {
  popularMovies: Movie[];
  genreMap: Record<number, string>;
}

export default function MovieList({ popularMovies, genreMap }: MovieListProps) {
  return (
    <div className="movie-list">
      {popularMovies.map((movie) => (
        <MovieCard
          key={movie.id}
          popularMovieCard={movie}
          genreMap={genreMap}
        />
      ))}
    </div>
  );
}