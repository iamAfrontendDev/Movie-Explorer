import { useEffect, useRef, useState } from "react";
import type { Movie, Genre } from "../types/movie";
import MovieList from "../components/MovieList";
import { getPopularMovies } from "../api/movieAPI";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { fetchFROMTMDB } from "../api/tmdbClient";
import { TMDB_BASE_URL } from "../constants/constants";

export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [genreMap, setGenreMap] = useState<Record<number, string>>({});
  const pageRef = useRef<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const loadingRef = useRef<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const bottomDivRef = useRef<HTMLDivElement | null>(null);
  const hasMoreRef = useRef<boolean>(true);

  // Load first page on mount
  useEffect(() => {
    loadMovies(pageRef.current);
  }, []);

  async function loadMovies(page: number) {
    setLoading(true);
    loadingRef.current = true;

    try {
      const popularMoviesData = await getPopularMovies(page);

      if (!popularMoviesData || popularMoviesData.length === 0) {
        setHasMore(false);
        hasMoreRef.current = false;
      }

      setPopularMovies((prev) => [...prev, ...popularMoviesData]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }

  // Fetch genres and create map
  useEffect(() => {
    async function fetchGenres() {
      try {
        const data = await fetchFROMTMDB<{ genres: Genre[] }>(
          `${TMDB_BASE_URL}/genre/movie/list`,
          {},
          false, // we want the full object here
        );

        const map: Record<number, string> = {};
        data.genres.forEach((g) => {
          map[g.id] = g.name;
        });

        setGenreMap(map);
      } catch (error) {
        console.error("Failed to fetch genres", error);
      }
    }

    fetchGenres();
  }, []);

  // Infinite scroll hook
  useInfiniteScroll({
    loadingRef,
    hasMoreRef,
    loadMovies,
    bottomDivRef,
    pageRef,
  });

  return (
    <>
      <MovieList popularMovies={popularMovies} genreMap={genreMap} />
      <div ref={bottomDivRef} style={{ height: "1px" }} />
      {loading && <h1>Loading...</h1>}
      {!hasMore && <h1>No More Movies To Show</h1>}
    </>
  );
}
