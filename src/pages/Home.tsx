import { useEffect, useRef, useState } from "react";
import type { Movie, MovieFilter, Genre } from "../types/movie";
import MovieList from "../components/MovieList";
import { getPopularMovies } from "../api/movieAPI";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { fetchFROMTMDB } from "../api/tmdbClient";
import { TMDB_BASE_URL } from "../constants/constants";
import MovieFilters from "../components/MovieFilter";

export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [movieFilters, setMovieFilters] = useState<MovieFilter>({
    genre: "",
    year: "",
    rating: "",
  });
  const [genreMap, setGenreMap] = useState<Record<number, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const pageRef = useRef<number>(1);
  const bottomDivRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<boolean>(false);
  const hasMoreRef = useRef<boolean>(true);

  // Load initial movies
  useEffect(() => {
    loadMovies(pageRef.current);
  }, []);

  async function loadMovies(page: number) {
    setLoading(true);
    loadingRef.current = true;

    try {
      const data = await getPopularMovies(page);

      if (!data || data.length === 0) {
        setHasMore(false);
        hasMoreRef.current = false;
      }

      setPopularMovies((prev) => [...prev, ...data]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }

  // Fetch genres
  useEffect(() => {
    async function fetchGenres() {
      try {
        const data = await fetchFROMTMDB<{ genres: Genre[] }>(
          `${TMDB_BASE_URL}/genre/movie/list`,
          {},
          false,
        );
        const map: Record<number, string> = {};
        data.genres.forEach((g) => (map[g.id] = g.name));
        setGenreMap(map);
      } catch (err) {
        console.error(err);
      }
    }
    fetchGenres();
  }, []);

  // Apply filters & search
  useEffect(() => {
    const filtered = popularMovies.filter((movie) => {
      const matchesGenre =
        !movieFilters.genre ||
        movie.genre_ids.includes(Number(movieFilters.genre));

      const matchesYear =
        !movieFilters.year ||
        movie.release_date?.startsWith(String(movieFilters.year));

      const matchesRating =
        !movieFilters.rating ||
        movie.vote_average >= Number(movieFilters.rating);

      const matchesSearch =
        !searchQuery ||
        movie.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesGenre && matchesYear && matchesRating && matchesSearch;
    });

    setFilteredMovies(filtered);
  }, [popularMovies, movieFilters, searchQuery]);
  useInfiniteScroll({
    loadingRef,
    hasMoreRef,
    loadMovies,
    pageRef,
    bottomDivRef,
  });

  return (
    <div className="home-container">
      <MovieFilters
        filters={movieFilters}
        setFilters={setMovieFilters}
        genreMap={genreMap}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {loading && <h2 className="status-msg">Loading...</h2>}

      {!loading && filteredMovies.length === 0 && (
        <h2 className="status-msg">
          {searchQuery
            ? `No movies found for "${searchQuery}"`
            : "No movies match your filters"}
        </h2>
      )}

      <MovieList popularMovies={filteredMovies} genreMap={genreMap} />

      <div ref={bottomDivRef} style={{ height: "20px" }} />

      {!loading && !hasMore && filteredMovies.length > 0 && (
        <h2 className="status-msg">No more movies to show</h2>
      )}
    </div>
  );
}
