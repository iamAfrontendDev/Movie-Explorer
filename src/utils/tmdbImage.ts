// src/utils/tmdbImage.ts
export function getPosterUrl(
  posterPath: string,
  size: "w154" | "w185" | "w342" | "w500" = "w185",
) {
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}