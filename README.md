# Movie Explorer Dashboard

## Overview

This is a Movie Explorer Dashboard built using **React** and **TypeScript**. The app allows users to discover movies, browse lists with infinite scroll, view movie details, and filter by genres. It fetches data from the **TMDB public API**.

## Features Implemented

- Browse popular movies with **infinite scroll**
- Display movie **poster, title, release year, rating, overview, and genres**
- Dynamic fetching of **genre list** to display genre names
- Loading and empty states handled
- Modular and maintainable architecture using:
  - `Home.tsx` as main page
  - `MovieList` for listing movies
  - `MovieCard` for individual movie display
  - `fetchFROMTMDB` as API utility

**Note:** Clicking a movie card to view full details is pending implementation.

## Setup Instructions

1. Clone the repository:

   git clone <your-repo-url>
   cd <repo-folder>

2. Install dependencies:

   npm install

   # or

   yarn install

3. Start the development server:

   npm start

   # or

   yarn dev

4. Open your browser at `http://localhost:3000` (or the port shown in terminal).

## TMDB API Configuration

- **TMDB Base URL:** `https://api.themoviedb.org/3`
- **TMDB Read Access Token:**
  `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNWYyMDY0NDEyZWI5ZjZhZWFkMmNiNGYxMjdmNWIxNiIsInN1YiI6IjY5MzQwMjY2MGE2NjFkNjNkNmI3MGRiNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WJIvF2pI45Pr_KeVmP30y5BJsKafjJrOY1JW2jMjXGc`
- **TMDB API Key:** `b5f2064412eb9f6aead2cb4f127f5b16`

> The `fetchFROMTMDB` utility automatically attaches the token to requests.

## Architecture Overview

- **Home.tsx**: Manages state (`popularMovies`, `filteredMovies`, `genreMap`, `page`, `loading`, `hasMore`) and triggers infinite scroll.
- **MovieList.tsx**: Receives `filteredMovies` and `genreMap` as props and renders movie cards.
- **MovieCard.tsx**: Displays individual movie information — poster, title, release year, rating, overview, and genres.
- **Hooks**: `useInfiniteScroll` handles infinite scrolling logic.
- **API Layer**: `fetchFROMTMDB` abstracts API calls, centralizing base URL and token usage.

## Key Design Decisions

- **Ref-based throttling** in `useInfiniteScroll` ensures efficient API calls.
- **Client-side filtering** is applied on top of fetched movie data for simplicity.
- **State vs Context**: Local state (`useState`, `useRef`) is sufficient for current requirements.
- **Separation of concerns** ensures components remain reusable and easy to maintain.

## Known Limitations / Next Steps

- **Initial infinite scroll behavior issue**:
  On the first load, infinite scroll may not trigger immediately due to rendering timing, observer attachment order, and viewport height constraints. In some cases, the user must scroll once before additional data loads. This behavior is a known limitation and can be refined further.

- **Duplicate empty-state messages during search and filtering**:
  The following conditional render in `Home.tsx`:

  ```tsx
  {
    !loading && filteredMovies.length === 0 && (
      <h2 className="status-msg">
        {searchQuery
          ? `No movies found for "${searchQuery}"`
          : "No movies match your filters"}
      </h2>
    );
  }
  ```

  can result in **multiple empty-state messages** being shown when both the UI condition and the filtered movie list logic evaluate an empty state at the same time. This can be resolved by centralizing empty-state rendering into a single conditional block.

- API failures are logged to the console; more **user-friendly error handling** can be added.

- Styling is responsive but not pixel-perfect and can be improved.
