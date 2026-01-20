import { TMDB_API_KEY } from "../constants/constants";

export async function fetchFROMTMDB<T>(
  url: string,
  options?: RequestInit,
  extractResults: boolean = true,
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error("TMDB request failed");
    }

    const data = await response.json();

    // LIST APIs → return data.results
    if (extractResults) {
      return data.results as T;
    }

    // DETAIL / METADATA APIs → return full object
    return data as T;
  } catch (error) {
    console.error("TMDB fetch error:", error);
    throw error;
  }
}
