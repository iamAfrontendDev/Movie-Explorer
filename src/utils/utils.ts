import type { Movie, MovieFilter } from "../types/movie";

export function filterMovies(movies: Movie[], filters: MovieFilter): Movie[] {
  return movies.filter((movie) => {
    const matchesGenre =
      !filters.genre || movie.genre_ids.includes(Number(filters.genre));
    const matchesYear =
      !filters.year || movie.release_date.startsWith(String(filters.year));
    const matchesRating =
      !filters.rating || movie.vote_average >= Number(filters.rating);
    return matchesGenre && matchesYear && matchesRating;
  });
}