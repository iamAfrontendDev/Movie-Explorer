import type { Movie } from "../types/movie";
import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

interface MovieCardProps {
  popularMovieCard: Movie;
  genreMap: Record<number, string>;
}

export default function MovieCard({
  popularMovieCard: {
    title,
    overview,
    release_date,
    vote_average,
    genre_ids,
    poster_path,
    id,
  },
  genreMap,
}: MovieCardProps) {
  const genreNames = genre_ids.map((id) => genreMap[id] || "unknown");
  const navigate = useNavigate();
  function handleMovieDetails(moviedId: number) {
    navigate(`/movie/${moviedId}`);
  }

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
        <p className="movie-genres">{genreNames.join(", ")}</p>
        <p className="movie-release">Release: {release_date}</p>
        <p className="movie-rating">Rating: {vote_average}</p>
        <button onClick={() => handleMovieDetails(id)}>
          Click For Movie Details
        </button>
      </div>
    </div>
  );
}
