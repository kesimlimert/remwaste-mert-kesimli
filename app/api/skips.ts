import type { Skip } from "../routes/+types/home";

export async function getSkipsByLocation(postcode: string, area: string = ""): Promise<Skip[]> {
  try {
    const response = await fetch(
      `https://app.wewantwaste.co.uk/api/skips/by-location?postcode=${postcode}&area=${area}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch skips: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching skips:", error);
    return [];
  }
} 