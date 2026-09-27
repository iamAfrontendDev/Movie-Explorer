// src/utils/genreCache.ts
export function getCachedGenres(): Record<number, string> | null {
  try {
    const cached = localStorage.getItem("tmdb-genres");
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

export function saveCachedGenres(genres: Record<number, string>) {
  try {
    localStorage.setItem("tmdb-genres", JSON.stringify(genres));
  } catch {
    // localStorage might be full or disabled — safe to ignore
  }
}