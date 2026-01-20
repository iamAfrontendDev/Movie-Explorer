// MovieList.tsx
import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieListProps {
  popularMovies: Movie[];
  genreMap: Record<number, string>;
}

export default function MovieList({ popularMovies, genreMap }: MovieListProps) {
  // Remove duplicates by movie id
  const uniqueMovies = Array.from(
    new Map(
      popularMovies.map((popularMovieCard) => [
        popularMovieCard.id,
        popularMovieCard,
      ]),
    ).values(),
  );

  if (uniqueMovies.length === 0) {
    return <h2>No movies match your filters</h2>;
  }

  return (
    <div className="movie-list">
      {uniqueMovies.map((popularMovieCard, index) => (
        // key = movie.id + index ensures uniqueness even if duplicates exist
        <MovieCard
          key={`${popularMovieCard.id}-${index}`}
          popularMovieCard={popularMovieCard}
          genreMap={genreMap}
        />
      ))}
    </div>
  );
}
