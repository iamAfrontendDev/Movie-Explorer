export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  poster_path: string | null;
  backdrop_path?: string | null;
}
export interface Genre {
  id: number;
  name: string;
}
export interface MovieApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: { id: number; name: string }[];
}

export interface MovieFilter {
  genre: string;
  year: number | string;
  rating: number | string;
}
