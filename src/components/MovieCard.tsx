import { Link } from "react-router-dom";
import type { Movie } from "../types/movie";
import "./MovieCard.css";
import { getPosterUrl } from "../utils/tmdbImage";

interface MovieCardProps {
  popularMovieCard: Movie;
  genreMap: Record<number, string>;
  priority:boolean
}

export default function MovieCard({
  popularMovieCard: {
    id,
    title,
    overview,
    release_date,
    vote_average,
    genre_ids,
    poster_path,
  },
  genreMap,
  priority
}: MovieCardProps) {
  // Some search results have no genre_ids, and genreMap may still be loading
  const genreNames = (genre_ids || [])
    .map((genreId) => genreMap[genreId])
    .filter(Boolean);

  const year = release_date ? release_date.slice(0, 4) : "";
  const rating = vote_average > 0 ? vote_average.toFixed(1) : null;

  return (
    // The whole card is the link — no separate "details" button needed
    <Link to={`/movie/${id}`} className="movie-card">
      <div className="movie-card-poster">
        {poster_path ? (
          <img
            src={getPosterUrl(poster_path,"w185")}
            alt=""
            loading={priority ? undefined : "lazy"}
            width={185}
            height={278}
            fetchPriority={priority ? "high" : undefined}
          />
        ) : (
          <div className="movie-card-no-poster">No poster</div>
        )}

        {rating && (
          <span
            className="movie-card-rating"
            aria-label={`Rated ${rating} out of 10`}
          >
            ★ {rating}
          </span>
        )}

        {overview && (
          <div className="movie-card-overlay" aria-hidden="true">
            <p className="movie-card-overview">{overview}</p>
          </div>
        )}
      </div>

      <h3 className="movie-card-title">{title}</h3>

      <p className="movie-card-meta">
        {year && <span>{year}</span>}
        {genreNames[0] && <span>{genreNames[0]}</span>}
      </p>
    </Link>
  );
}