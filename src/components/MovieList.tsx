// MovieList.tsx
import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieListProps {
  popularMovies: Movie[];
  genreMap:Record<number, string>
}

export default function MovieList({ popularMovies,genreMap }: MovieListProps) {
  return (
    <div className="movie-list">
      {popularMovies.map((movieCard) => (
        <MovieCard popularMovieCard={movieCard} key={movieCard.id} genreMap={genreMap}/>
      ))}
    </div>
  );
}
