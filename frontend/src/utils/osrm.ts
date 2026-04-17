import axios from 'axios';
import type { RouteResult } from '@/types';

interface OSRMResponse {
  routes: {
    distance: number;
    duration: number;
    geometry: { coordinates: [number, number][] };
  }[];
}

/**
 * Get the shortest drivable route between two [lat, lng] points using public OSRM.
 */
export async function getRoute(
  start: [number, number],
  end: [number, number],
): Promise<RouteResult> {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}`;

  const { data } = await axios.get<OSRMResponse>(url, {
    params: { overview: 'full', geometries: 'geojson', steps: false },
  });

  if (!data.routes.length) throw new Error('No route found.');

  const route = data.routes[0];
  // OSRM returns [lng, lat], convert to [lat, lng]
  const coordinates: [number, number][] = route.geometry.coordinates.map(
    ([lng, lat]) => [lat, lng],
  );

  return {
    coordinates,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
  };
}