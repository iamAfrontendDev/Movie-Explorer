import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Movie } from "../types/movie";
import { TMDB_IMAGE_BASE_URL } from "../constants/constants";
import "./Moviecarousel.css";

interface MovieCarouselProps {
  movies: Movie[];
  label: string;
}

export default function MovieCarousel({ movies, label }: MovieCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  // Show/hide the arrows depending on how far the row is scrolled
  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanGoBack(track.scrollLeft > 4);
    setCanGoForward(
      track.scrollLeft + track.clientWidth < track.scrollWidth - 4,
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateArrows();
    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      track.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [movies, updateArrows]);

  // Move by roughly one screen-width of posters
  function slide(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    track.scrollBy({
      left: direction * track.clientWidth * 0.9,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <div className="carousel" role="region" aria-label={label}>
      <button
        type="button"
        className="carousel-arrow carousel-arrow-back"
        onClick={() => slide(-1)}
        disabled={!canGoBack}
        aria-label="Show previous movies"
      >
        ‹
      </button>

      <ul className="carousel-track" ref={trackRef}>
        {movies.map((movie) => (
          <li key={movie.id} className="carousel-item">
            <Link to={`/movie/${movie.id}`} className="carousel-card">
              <div className="carousel-poster">
                {movie.poster_path ? (
                  <img
                    src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <span className="carousel-no-poster">No poster</span>
                )}
              </div>
              <span className="carousel-title">{movie.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="carousel-arrow carousel-arrow-forward"
        onClick={() => slide(1)}
        disabled={!canGoForward}
        aria-label="Show more movies"
      >
        ›
      </button>
    </div>
  );
}