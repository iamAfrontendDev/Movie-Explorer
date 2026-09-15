import { useEffect, useRef, useState } from "react";
import {
  type GenreListResponse,
  type Genre,
  type Movie,
  type TMDBPaginatedResponse,
} from "../types/movie";
import MovieList from "../components/MovieList";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { TMDB_BASE_URL } from "../constants/constants";
import { useFetch } from "../hooks/useFetch";

export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const url = `${TMDB_BASE_URL}/movie/popular?page=${page}`;
  const { data, loading, isFetchingRef, error } =
    useFetch<TMDBPaginatedResponse<Movie>>(url);
  const sentinalRef = useRef<HTMLDivElement | null>(null);
  const hasMoreRef = useRef<boolean>(true);
  console.log("data", data);
  const [genreMap, setGenreMap] = useState<Record<number, string>>({});
  console.log(genreMap);
  const genreListUrl = `${TMDB_BASE_URL}/genre/movie/list`;
  const { data: genreListData } = useFetch<GenreListResponse>(genreListUrl);
  useEffect(() => {
    if (data) {
      setPopularMovies((prev) => [...prev, ...data.results]);
      const checkHasmore = data.page >= data.total_pages;
      if (checkHasmore) {
        hasMoreRef.current = false;
      }
    }
  }, [data]);
  const covertGenreMap = (genres: Genre[]) => {
    const map: Record<number, string> = {};
    for (let i = 0; i < genres.length; i++) {
      map[genres[i].id] = genres[i].name;
    }
    return map;
  };
  useEffect(() => {
    if (genreListData?.genres) {
      setGenreMap(covertGenreMap(genreListData.genres));
    }
  }, [genreListData]);

  useInfiniteScroll(sentinalRef, () => {
    if (hasMoreRef.current && !isFetchingRef.current) {
      setPage((prev) => prev + 1);
    }
  });
  return (
    <div className="home-container">
      {loading && <h2>Loading...</h2>}
      {popularMovies.length === 0 && !loading && !error && (
        <h2>No Movies Available</h2>
      )}
      <MovieList popularMovies={popularMovies} genreMap={genreMap} />
      {error && (
        <h2>Something went wrong while loading movies. Please try again.</h2>
      )}
      {popularMovies.length > 0 && (
        <div ref={sentinalRef} style={{ height: "10px" }} />
      )}
    </div>
  );
}
