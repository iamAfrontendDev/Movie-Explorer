import { TMDB_API_KEY } from "../constants/constants";

export async function fetchFROMTMDB<T = any[]>(
  URL: string,
  options?: RequestInit,
  extractResults: boolean = true,
): Promise<T> {
  try {
    const response = await fetch(URL, {
      ...options,
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`TMDB API request failed: ${response.status}`);
    }

    const data = await response.json();

    // Return only results array if extractResults is true
    if (extractResults) {
      return data.results ?? [];
    }

    return data;
  } catch (error) {
    console.error("fetchFROMTMDB error:", error);
    return extractResults ? ([] as any as T) : ({} as T);
  }
}
