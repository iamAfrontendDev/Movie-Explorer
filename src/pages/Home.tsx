import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GenreListResponse,
  type Genre,
  type Movie,
  type TMDBPaginatedResponse,
  type MovieFilter,
} from "../types/movie";
import MovieList from "../components/MovieList";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { TMDB_BASE_URL } from "../constants/constants";
import { useFetch } from "../hooks/useFetch";
import MovieFilters from "../components/MovieFilter";
import { useDebounce } from "../hooks/useDebounce";

export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<MovieFilter>({
    searchQuery: "",
    genre: "",
    year: "",
    rating: "",
  });
  const url = `${TMDB_BASE_URL}/movie/popular?page=${page}`;
  const { data, loading, isFetchingRef, error } =
    useFetch<TMDBPaginatedResponse<Movie>>(url);
  const hasMoreRef = useRef<boolean>(true);
  const hasMoreSearchRef = useRef<boolean>(true);
  const [genreMap, setGenreMap] = useState<Record<number, string>>({});
  const genreListUrl = `${TMDB_BASE_URL}/genre/movie/list`;
  const [searchMovies, setSearchMovies] = useState<Movie[]>([]);
  const [searchPage, setSearchPage] = useState<number>(1);
  const [searchHasMore, setSearchHasMore] = useState<boolean>(true);
  const debouncedSearch = useDebounce(filters.searchQuery, 1000);
  const searchUrl = `${TMDB_BASE_URL}/search/movie?query=${debouncedSearch}&page=${searchPage}`;
  const { data: searchResults, isFetchingRef: isSearchFetchingRef } =
    useFetch<TMDBPaginatedResponse<Movie>>(searchUrl);
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

  useEffect(() => {
    if (searchResults) {
      setSearchMovies((prev) => [...prev, ...searchResults.results]);
      const checkSearchHasMore =
        searchResults.page >= searchResults.total_pages;
      if (checkSearchHasMore) {
        setSearchHasMore(false);
        hasMoreSearchRef.current = false;
      }
    }
  }, [searchResults]);
  useEffect(() => {
    setSearchPage(1);
    setSearchMovies([]);
    setSearchHasMore(true);
    hasMoreSearchRef.current = true;
  }, [debouncedSearch]);
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

  const handleIntersect = useCallback(() => {
    if (debouncedSearch) {
      if (hasMoreSearchRef.current && !isSearchFetchingRef.current) {
        setSearchPage((prev) => prev + 1);
      }
    } else {
      if (hasMoreRef.current && !isFetchingRef.current) {
        setPage((prev) => prev + 1);
      }
    }
  }, [debouncedSearch]);

  const sentinalRef = useInfiniteScroll(handleIntersect);
  return (
    <div className="home-container">
      {loading && <h2>Loading...</h2>}
      {page === 1 && data && data.results.length === 0 && (
        <h2>No Movies Available</h2>
      )}
      <MovieFilters
        filters={filters}
        setFilters={setFilters}
        genreMap={genreMap}
      />
      <MovieList
        popularMovies={!debouncedSearch ? popularMovies : searchMovies}
        genreMap={genreMap}
      />
      {error && (
        <h2>Something went wrong while loading movies. Please try again.</h2>
      )}
      {debouncedSearch && !searchHasMore && searchMovies.length === 0 && (
        <h2>No movies found</h2>
      )}

      {debouncedSearch && !searchHasMore && searchMovies.length > 0 && (
        <h2>No more movies available</h2>
      )}
      {(!debouncedSearch
        ? popularMovies.length > 0
        : searchMovies.length > 0) && (
        <div ref={sentinalRef} style={{ height: "10px" }} />
      )}
    </div>
  );
}
