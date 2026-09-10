import { useEffect, useState } from "react";
import type { MovieApiResponse } from "../types/movie";
import { TMDB_API_KEY } from "../constants/constants";

export function useFetch<T>(url: string, options?: RequestInit):MovieApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
     // Prevent fetching if URL is empty (useful for dynamic searches)
    if(!url) return
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          ...options,
          headers:{
            Authorization:`Bearer ${TMDB_API_KEY}`,
            "Content-Type":"application/json"
          },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Error ${response.status} Failed to Fetch movies`);
        const result = await response.json();
        setData(result);
      } catch (e) {
        // Don't update state if the fetch was intentionally cancelled
        if (e instanceof Error && e.name === "AbortError") {
          return;
        } else {
          setError(e instanceof Error ? e.message :"An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
     // Clean up: Aborts the network request if the component unmounts 
    // or if the user types a new character in the search bar
    return () => controller.abort();
  }, [url]);
  return { data, loading, error };
}
