import axios from 'axios';

export interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

/**
 * Geocode a place name or "lat,lng" string to [lat, lng] via Nominatim.
 */
export async function geocode(query: string): Promise<[number, number]> {
  // If already "lat,lng" format, parse directly
  const directMatch = query.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (directMatch) {
    return [parseFloat(directMatch[1]), parseFloat(directMatch[2])];
  }

  const { data } = await axios.get<NominatimResult[]>(
    'https://nominatim.openstreetmap.org/search',
    {
      params: { q: query, format: 'json', limit: 1 },
      headers: { 'Accept-Language': 'en' },
    },
  );

  if (!data.length) throw new Error(`Location not found: "${query}"`);
  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}