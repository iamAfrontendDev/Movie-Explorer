import type { Movie } from "../types/movie";
import "./MovieCard.css";

interface MovieCardProps {
  popularMovieCard: Movie;
}

export default function MovieCard({
  popularMovieCard: {
    title,
    overview,
    release_date,
    vote_average,
    // genre_ids,
    poster_path,
    // id,
  },
}: MovieCardProps) {
  return (
    <div className="movie-card">
      {poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w300${poster_path}`}
          alt={title}
          className="movie-poster"
        />
      )}
      <div className="movie-info">
        <h2 className="movie-title">{title}</h2>
        <p className="movie-overview">{overview}</p>
        {/* <p className="movie-genres">{genreNames.join(", ")}</p> */}
        <p className="movie-release">Release: {release_date}</p>
        <p className="movie-rating">Rating: {vote_average}</p>
        {/* <button onClick={() => handleMovieDetails(id)}>
          Click For Movie Details
        </button> */}
      </div>
    </div>
  );
}
