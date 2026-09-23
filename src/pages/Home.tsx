import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type GenreListResponse,
  type Genre,
  type Movie,
  type TMDBPaginatedResponse,
  type MovieFilter,
} from "../types/movie";
import MovieList from "../components/MovieList";
import MovieFilters from "../components/MovieFilter";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import { TMDB_BASE_URL } from "../constants/constants";
import { filterMovies } from "../utils/utils";
import "./Home.css";

const AUTO_LOAD_LIMIT = 5;

export default function Home() {
  // ---------- Filters ----------
  const [filters, setFilters] = useState<MovieFilter>({
    searchQuery: "",
    genre: "",
    year: "",
    rating: "",
  });
  const [appliedFilters, setAppliedFilters] = useState<MovieFilter>(filters);

  // ---------- Popular movies ----------
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const hasMoreRef = useRef<boolean>(true);

  const url = `${TMDB_BASE_URL}/movie/popular?page=${page}`;
  const { data, loading, isFetchingRef, error } =
    useFetch<TMDBPaginatedResponse<Movie>>(url);

  // ---------- Search ----------
  const [searchMovies, setSearchMovies] = useState<Movie[]>([]);
  const [searchPage, setSearchPage] = useState<number>(1);
  const [searchHasMore, setSearchHasMore] = useState<boolean>(true);
  const hasMoreSearchRef = useRef<boolean>(true);

  const debouncedSearch = useDebounce(filters.searchQuery, 1000);
  const searchUrl = `${TMDB_BASE_URL}/search/movie?query=${debouncedSearch}&page=${searchPage}`;
  const {
    data: searchResults,
    loading: searchLoading,
    isFetchingRef: isSearchFetchingRef,
  } = useFetch<TMDBPaginatedResponse<Movie>>(searchUrl);

  // ---------- Genres ----------
  const [genreMap, setGenreMap] = useState<Record<number, string>>({});
  const genreListUrl = `${TMDB_BASE_URL}/genre/movie/list`;
  const { data: genreListData } = useFetch<GenreListResponse>(genreListUrl);

  // ---------- Auto-load limit ----------
  const autoLoadCountRef = useRef(0);
  const [showLoadMore, setShowLoadMore] = useState(false);

  // Add each popular page to the list
  useEffect(() => {
    if (data) {
      setPopularMovies((prev) => [...prev, ...data.results]);
      if (data.page >= data.total_pages) {
        hasMoreRef.current = false;
      }
    }
  }, [data]);

  // Add each search page to the list
  useEffect(() => {
    if (searchResults) {
      setSearchMovies((prev) => [...prev, ...searchResults.results]);
      if (searchResults.page >= searchResults.total_pages) {
        setSearchHasMore(false);
        hasMoreSearchRef.current = false;
      }
    }
  }, [searchResults]);

  // New search word → start the search fresh
  useEffect(() => {
    setSearchPage(1);
    setSearchMovies([]);
    setSearchHasMore(true);
    hasMoreSearchRef.current = true;
    autoLoadCountRef.current = 0;
    setShowLoadMore(false);
  }, [debouncedSearch]);

  // Turn the genre list into { id: name }
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

  // Sentinel came ON screen → maybe load the next page
  const handleIntersect = useCallback(() => {
    if (debouncedSearch) {
      if (hasMoreSearchRef.current && !isSearchFetchingRef.current) {
        if (autoLoadCountRef.current >= AUTO_LOAD_LIMIT) {
          setShowLoadMore(true);
          return;
        }
        autoLoadCountRef.current += 1;
        setSearchPage((prev) => prev + 1);
      }
    } else {
      if (hasMoreRef.current && !isFetchingRef.current) {
        if (autoLoadCountRef.current >= AUTO_LOAD_LIMIT) {
          setShowLoadMore(true);
          return;
        }
        autoLoadCountRef.current += 1;
        setPage((prev) => prev + 1);
      }
    }
  }, [debouncedSearch]);

  // Sentinel went OFF screen → the screen filled up, reset the count
  const handleLeave = useCallback(() => {
    autoLoadCountRef.current = 0;
  }, []);

  // ---------- Which list is active right now ----------
  const activeMovies = debouncedSearch ? searchMovies : popularMovies;
  const activeLoading = debouncedSearch ? searchLoading : loading;

  // Grows by 20 every time a page loads → tells the observer to look again
  const loadedCount = activeMovies.length;

  const sentinalRef = useInfiniteScroll(
    handleIntersect,
    loadedCount,
    handleLeave,
  );

  // Apply button
  function handleApply() {
    setAppliedFilters(filters);
    autoLoadCountRef.current = 0;
    setShowLoadMore(false);
  }

  // Clear filters button → empty genre/year/rating, keep the search text
  function handleClearFilters() {
    const cleared = { ...filters, genre: "", year: "", rating: "" };
    setFilters(cleared);
    setAppliedFilters(cleared);
    autoLoadCountRef.current = 0;
    setShowLoadMore(false);
  }

  // Is any filter typed/selected or currently applied?
  const hasFilters = Boolean(
    filters.genre ||
      filters.year ||
      filters.rating ||
      appliedFilters.genre ||
      appliedFilters.year ||
      appliedFilters.rating,
  );

  // Load more button
  function handleLoadMore() {
    autoLoadCountRef.current = 0;
    setShowLoadMore(false);
    if (debouncedSearch) {
      setSearchPage((prev) => prev + 1);
    } else {
      setPage((prev) => prev + 1);
    }
  }

  // Filtered lists (only re-run when the list or applied filters change)
  const filteredPopularMovies = useMemo(
    () => filterMovies(popularMovies, appliedFilters),
    [popularMovies, appliedFilters],
  );

  const filteredSearchMovies = useMemo(
    () => filterMovies(searchMovies, appliedFilters),
    [searchMovies, appliedFilters],
  );

  const moviesToShow = debouncedSearch
    ? filteredSearchMovies
    : filteredPopularMovies;

  return (
    <div className="home">
      <header className="topbar">
        <div className="topbar-inner">
          <span className="brand">Movie Explorer</span>
          <MovieFilters
            filters={filters}
            setFilters={setFilters}
            genreMap={genreMap}
            onApply={handleApply}
            onClear={handleClearFilters}
            hasFilters={hasFilters}
          />
        </div>
      </header>

      <main className="home-main">
        <h1 className="section-title">
          {debouncedSearch
            ? `Results for “${debouncedSearch}”`
            : "Popular right now"}
        </h1>

        {/* First load only — nothing on screen yet */}
        {activeLoading && activeMovies.length === 0 && (
          <p className="status">Loading movies…</p>
        )}

        {page === 1 && data && data.results.length === 0 && (
          <p className="status">No movies to show right now.</p>
        )}

        <MovieList popularMovies={moviesToShow} genreMap={genreMap} />

        {/* Space is always reserved, so the page never jumps */}
        {activeMovies.length > 0 && (
          <div className="loading-more" aria-live="polite">
            {activeLoading && (
              <>
                <span className="spinner" aria-hidden="true" />
                <span>Loading more…</span>
              </>
            )}
          </div>
        )}

        {showLoadMore && (
          <div className="load-more">
            <p>
              {moviesToShow.length === 0
                ? "No movies match your filters yet."
                : `Only ${moviesToShow.length} ${moviesToShow.length === 1 ? "match" : "matches"} so far.`}
            </p>
            <button
              type="button"
              className="load-more-btn"
              onClick={handleLoadMore}
            >
              Load more
            </button>
          </div>
        )}

        {error && (
          <p className="status status-error">
            Couldn't load movies. Check your connection and refresh the page.
          </p>
        )}

        {debouncedSearch && !searchHasMore && searchMovies.length === 0 && (
          <p className="status">
            No movies found for “{debouncedSearch}”. Try a different title.
          </p>
        )}

        {debouncedSearch && !searchHasMore && searchMovies.length > 0 && (
          <p className="status">That's every result for “{debouncedSearch}”.</p>
        )}

        {activeMovies.length > 0 && (
          <div ref={sentinalRef} style={{ height: "10px" }} />
        )}
      </main>
    </div>
  );
}