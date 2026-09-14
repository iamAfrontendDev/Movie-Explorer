// MovieList.tsx
import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieListProps {
  popularMovies: Movie[];
}

export default function MovieList({ popularMovies }: MovieListProps) {
  return (
    <div className="movie-list">
      {popularMovies.map((movieCard) => (
        <MovieCard popularMovieCard={movieCard} key={movieCard.id}/>
      ))}
    </div>
  );
}
