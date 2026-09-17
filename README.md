# Movie Explorer Dashboard

A movie discovery app built with **React**, **TypeScript**, and **Vite**, powered by the **TMDB API**. Browse popular movies with infinite scroll, search the full TMDB catalog, and view detailed movie info with related titles.

## Features

- Browse popular movies with infinite scroll
- Search movies by title, debounced and fetched live from TMDB (not limited to already-loaded results)
- Movie details page with overview, release date, rating, genres, and backdrop/poster
- Related movies on the details page, with its own independent pagination
- Genre names resolved and shown on each movie card
- Loading, empty, and error states throughout — while browsing, while searching, and at the end of results
- Filters UI for genre, release year, and minimum rating (filtering logic in progress)

## Tech Stack

- React 19 + TypeScript + Vite
- TMDB API (`https://api.themoviedb.org/3`)
- No UI library — custom components and CSS

## Getting Started

1. Clone the repo and install dependencies:
```bash
   git clone <this-repo-url>
   cd Movie-Explorer
   npm install
```

2. Create a `.env` file in the project root:

VITE_TMDB_API_KEY=your_tmdb_api_read_access_token_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_BASE_IMAGE_URL=https://image.tmdb.org/t/p/w500

   You can get a free API key/read access token at [themoviedb.org](https://www.themoviedb.org/settings/api).

3. Start the dev server:
```bash
   npm run dev
```
   Then open the local URL shown in your terminal (usually `http://localhost:5173`).

## Architecture

- **`useFetch`** — reusable data-fetching hook (loading/data/error state, `AbortController` cleanup, and an `isFetchingRef` for tracking in-flight requests synchronously)
- **`useInfiniteScroll`** — wraps an `IntersectionObserver` behind a callback ref, so the sentinel element is observed reliably even when it mounts after the initial render (e.g. once search results arrive)
- **`useDebounce`** — delays reacting to fast-changing input (used for search) until the user stops typing
- **`Home.tsx`** — handles popular-movie browsing and search as two independent flows, each with its own page counter, "has more" tracking, and accumulated results, so neither interferes with the other
- **`MovieList` / `MovieCard`** — presentational components; `MovieCard` resolves genre IDs to names via a lookup map passed down from `Home`
- **`MovieDetails.tsx`** — fetches a movie's details and its related movies as two independent requests

## Notable Decisions

- Search hits TMDB's `/search/movie` endpoint directly instead of filtering already-loaded popular movies, so results reflect TMDB's full catalog.
- Popular-movie browsing and search keep fully separate state, so switching between them doesn't cause one to affect the other.
- In-flight/has-more tracking inside the scroll logic uses refs rather than state, since state updates are asynchronous and can lag behind a quick sequence of scroll events.
- The scroll intersection handler is wrapped in `useCallback` to keep a stable function reference, preventing the observer from being torn down and recreated on every render.

## Known Limitations

- Genre, year, and rating filters have UI but no filtering logic applied yet.
- TMDB's search endpoint can occasionally return the same movie on more than one results page; duplicate-key warnings may show up during long search sessions.
- No automated tests yet.
- Styling is responsive but not pixel-perfect.