import { useParams, useNavigate } from "react-router-dom";
import { TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from "../constants/constants";
import type {
  Movie,
  MovieDetails,
  TMDBPaginatedResponse,
} from "../types/movie";
import { useFetch } from "../hooks/useFetch";
import MovieCarousel from "../components/Moviecarousel";
import "./MovieDetails.css";
import { getPosterUrl } from "../utils/tmdbImage";

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

  if (loading) return <p className="status">Loading movie…</p>;
  if (error)
    return (
      <p className="status status-error">
        Couldn't load this movie. Go back and try again.
      </p>
    );
  if (!movieDetails) return <p className="status">Movie not found.</p>;

  const {
    title,
    overview,
    release_date,
    vote_average,
    runtime,
    genres,
    poster_path,
    backdrop_path,
  } = movieDetails;

  const year = release_date ? release_date.slice(0, 4) : "";
  const rating = vote_average > 0 ? vote_average.toFixed(1) : null;
  const hours = runtime ? Math.floor(runtime / 60) : 0;
  const minutes = runtime ? runtime % 60 : 0;
  const runtimeText = runtime ? `${hours ? `${hours}h ` : ""}${minutes}m` : "";

  return (
    <div className="details">
      {/* Backdrop image with a dark fade so text stays readable */}
      <div
        className="details-backdrop"
        style={{
          backgroundImage: backdrop_path
            ? `url(${TMDB_IMAGE_BASE_URL}${backdrop_path})`
            : "none",
        }}
        aria-hidden="true"
      />

      <div className="details-inner">
        <button
          type="button"
          className="details-back"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="details-main">
          {poster_path ? (
            <img
              src={getPosterUrl(poster_path, "w500")}
              alt={`${title} poster`}
              className="details-poster"
            />
          ) : (
            <div className="details-poster details-no-poster">No poster</div>
          )}

          <div className="details-text">
            <h1 className="details-title">{title}</h1>

            <div className="details-facts">
              {rating && (
                <span
                  className="details-rating"
                  aria-label={`Rated ${rating} out of 10`}
                >
                  ★ {rating}
                </span>
              )}
              {year && <span>{year}</span>}
              {runtimeText && <span>{runtimeText}</span>}
            </div>

            {genres.length > 0 && (
              <ul className="genre-chips" aria-label="Genres">
                {genres.map((g) => (
                  <li key={g.id} className="genre-chip">
                    {g.name}
                  </li>
                ))}
              </ul>
            )}

            {overview && <p className="details-overview">{overview}</p>}
          </div>
        </div>
      </div>

      <section className="related" aria-labelledby="related-heading">
        <h2 id="related-heading" className="related-heading">
          More like this
        </h2>

        {relatedLoading && <p className="related-status">Loading…</p>}
        {relatedError && (
          <p className="related-status">Couldn't load similar movies.</p>
        )}
        {relatedMovies && relatedMovies.results.length === 0 && (
          <p className="related-status">No similar movies found.</p>
        )}

        {relatedMovies && relatedMovies.results.length > 0 && (
          <MovieCarousel
            movies={relatedMovies.results}
            label="More like this"
          />
        )}
      </section>
    </div>
  );
}
