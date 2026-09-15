import { useParams, useNavigate, Link } from "react-router-dom";
import { TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from "../constants/constants";
import type {
  Movie,
  MovieDetails,
  TMDBPaginatedResponse,
} from "../types/movie";
import "./MovieDetails.css";
import { useFetch } from "../hooks/useFetch";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movieDetailsUrl = `${TMDB_BASE_URL}/movie/${id}`;
  const {
    data: movieDetails,
    loading,
    error,
  } = useFetch<MovieDetails>(movieDetailsUrl);
  const relatedMoviesUrl = `${TMDB_BASE_URL}/movie/${id}/similar`;
  const {
    data: relatedMovies,
    loading: relatedLoading,
    error: relatedError,
  } = useFetch<TMDBPaginatedResponse<Movie>>(relatedMoviesUrl);

  if (loading) return <h2 className="status-msg">Loading...</h2>;
  if (error) return <h2 className="status-msg">{error}</h2>;
  if (!movieDetails) return <h2 className="status-msg">Movie Not Found</h2>;

  const {
    title,
    overview,
    release_date,
    vote_average,
    genres,
    poster_path,
    backdrop_path,
  } = movieDetails;

  return (
    <div className="movie-details-page">
      <div
        className="movie-backdrop"
        style={{
          backgroundImage: backdrop_path
            ? `url(${TMDB_IMAGE_BASE_URL}${backdrop_path})`
            : "none",
        }}
      >
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
        <div className="backdrop-overlay">
          <div className="movie-info">
            {poster_path && (
              <img
                src={`${TMDB_IMAGE_BASE_URL}${poster_path}`}
                alt={title}
                className="movie-poster"
              />
            )}
            <div className="movie-text">
              <h1>{title}</h1>
              <p>{overview}</p>
              <p>Genres: {genres.map((g) => g.name).join(", ")}</p>
              <p>Release: {release_date}</p>
              <p>Rating: {vote_average}</p>
            </div>
          </div>
        </div>
      </div>
      {relatedLoading && <h2>Loading Related Movies...</h2>}
      {relatedError && <h2>{relatedError}</h2>}
      {relatedMovies && relatedMovies.results.length === 0 && (
        <h2>No related movies found</h2>
      )}
      {relatedMovies && relatedMovies.results.length > 0 && (
        <div className="related-movies">
          <h2>Related Movies</h2>
          <div className="related-movies-grid">
            {relatedMovies.results.map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="related-movie-card"
              >
                {movie.poster_path ? (
                  <img
                    src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                  />
                ) : (
                  <div className="no-poster">No Image</div>
                )}
                <p>{movie.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
