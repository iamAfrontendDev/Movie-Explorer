import type { Dispatch, SetStateAction } from "react";
import type { MovieFilter } from "../types/movie";
import "./MovieFilter.css";

interface MovieFilterProps {
  filters: MovieFilter;
  setFilters: Dispatch<SetStateAction<MovieFilter>>;
  genreMap: Record<number, string>;
}

export default function MovieFilters({
  filters,
  setFilters,
  genreMap,
}: MovieFilterProps) {
  function handleFilterChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }
  return (
    <div className="filters-wrapper">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search movies..."
          value={filters.searchQuery}
          name="searchQuery"
          onChange={handleFilterChange}
        />
      </div>

      <div className="filters">
        <select
          value={filters.genre}
          onChange={handleFilterChange}
          name="genre"
        >
          <option value="">All Genres</option>
          {Object.keys(genreMap).map((id) => (
            <option key={id} value={id}>
              {genreMap[Number(id)]}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Year"
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
        />

        <input
          type="text"
          placeholder="Min Rating"
          value={filters.rating}
          name="rating"
          onChange={handleFilterChange}
        />
      </div>
    </div>
  );
}
