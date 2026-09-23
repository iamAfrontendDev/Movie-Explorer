import type { Dispatch, SetStateAction } from "react";
import type { MovieFilter } from "../types/movie";
import GenreSelect from "./GenreSelect";
import "./MovieFilter.css";

interface MovieFilterProps {
  filters: MovieFilter;
  setFilters: Dispatch<SetStateAction<MovieFilter>>;
  genreMap: Record<number, string>;
  onApply: () => void;
  onClear: () => void;
  hasFilters: boolean;
}

export default function MovieFilters({
  filters,
  setFilters,
  genreMap,
  onApply,
  onClear,
  hasFilters,
}: MovieFilterProps) {
  // Genre options, sorted A–Z so they're easier to scan
  const genreOptions = Object.keys(genreMap)
    .map((id) => ({ value: id, label: genreMap[Number(id)] }))
    .sort((a, b) => a.label.localeCompare(b.label));

  function handleFilterChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    if (name === "year" && !/^[0-9]{0,4}$/.test(value)) {
      return;
    }

    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="filters-wrapper">
      <div className="search-bar">
        <label htmlFor="search" className="sr-only">
          Search movies
        </label>
        <input
          id="search"
          type="search"
          placeholder="Search by title"
          value={filters.searchQuery}
          name="searchQuery"
          onChange={handleFilterChange}
          autoComplete="off"
        />
      </div>

      <div className="filters">
        <GenreSelect
          value={filters.genre}
          options={genreOptions}
          placeholder="All genres"
          onChange={(value) => setFilters((prev) => ({ ...prev, genre: value }))}
        />

        <label htmlFor="year" className="sr-only">
          Release year
        </label>
        <input
          id="year"
          type="text"
          inputMode="numeric"
          placeholder="Year"
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
        />

        <label htmlFor="rating" className="sr-only">
          Minimum rating
        </label>
        <input
          id="rating"
          type="text"
          inputMode="decimal"
          placeholder="Min rating"
          name="rating"
          value={filters.rating}
          onChange={handleFilterChange}
        />

        <button type="button" className="apply-btn" onClick={onApply}>
          Apply filters
        </button>

        <button
          type="button"
          className="clear-btn"
          onClick={onClear}
          disabled={!hasFilters}
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}