import { fetchFROMTMDB } from "./tmdbClient";
import { TMDB_BASE_URL } from "../constants/constants";
import type { Movie } from "../types/movie";

export async function getPopularMovies(page: number): Promise<Movie[]> {
  return fetchFROMTMDB<Movie[]>(
    `${TMDB_BASE_URL}/movie/popular?page=${page}`,
    {},
    true, // only extract results array
  );
}
