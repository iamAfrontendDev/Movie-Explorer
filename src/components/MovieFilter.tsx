import type { Dispatch, SetStateAction } from "react";
import type { MovieFilter } from "../types/movie";
import "./MovieFilter.css";

interface MovieFilterProps {
  filters: MovieFilter;
  setFilters: Dispatch<SetStateAction<MovieFilter>>;
  genreMap: Record<number, string>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

export default function MovieFilters({
  filters,
  setFilters,
  genreMap,
  searchQuery,
  setSearchQuery,
}: MovieFilterProps) {
  return (
    <div className="filters-wrapper">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filters">
        <select
          value={filters.genre}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, genre: e.target.value }))
          }
        >
          <option value="">All Genres</option>
          {Object.entries(genreMap).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Year"
          value={filters.year}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/, "");
            setFilters((prev) => ({ ...prev, year: val }));
          }}
        />

        <input
          type="text"
          placeholder="Min Rating"
          value={filters.rating}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9.]/g, "");
            setFilters((prev) => ({ ...prev, rating: val }));
          }}
        />
      </div>
    </div>
  );
}
