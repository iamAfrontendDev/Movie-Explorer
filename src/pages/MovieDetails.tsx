import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchFROMTMDB } from "../api/tmdbClient";
import { TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from "../constants/constants";
import type { MovieDetails as MovieDetailsType, Movie } from "../types/movie";
import "./MovieDetails.css";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movieDetails, setMovieDetails] = useState<MovieDetailsType | null>(
    null,
  );
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getMovieDetails(id);
  }, [id]);

  async function getMovieDetails(movieId: string) {
    setLoading(true);
    setError(null);
    try {
      const movie: MovieDetailsType = await fetchFROMTMDB(
        `${TMDB_BASE_URL}/movie/${movieId}`,
        undefined,
        false,
      );
      setMovieDetails(movie);

      const related: { results: Movie[] } = await fetchFROMTMDB(
        `${TMDB_BASE_URL}/movie/${movieId}/similar`,
        undefined,
        false,
      );
      setRelatedMovies(related.results);
    } catch (err) {
      setError("Failed to load movie details.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <h2 className="status-msg">Loading...</h2>;
  if (error) return <h2 className="status-msg">{error}</h2>;
  if (!movieDetails) return null;

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

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <div className="related-movies">
          <h2>Related Movies</h2>
          <div className="related-movies-grid">
            {relatedMovies.map((movie) => (
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
