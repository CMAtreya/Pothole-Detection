/**
 * Haversine distance between two [lat, lng] points in metres.
 */
export function haversineDistance(
  [lat1, lng1]: [number, number],
  [lat2, lng2]: [number, number],
): number {
  const R = 6_371_000; // Earth radius in metres
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Returns the bearing (degrees 0–360) from point A to point B.
 */
export function bearing(
  [lat1, lng1]: [number, number],
  [lat2, lng2]: [number, number],
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/**
 * Interpolates a position along an array of [lat, lng] waypoints at fraction t (0–1).
 */
export function interpolateRoute(
  coords: [number, number][],
  t: number,
): [number, number] {
  if (coords.length === 0) return [0, 0];
  if (t <= 0) return coords[0];
  if (t >= 1) return coords[coords.length - 1];

  // Compute cumulative distances
  const distances: number[] = [0];
  for (let i = 1; i < coords.length; i++) {
    distances.push(distances[i - 1] + haversineDistance(coords[i - 1], coords[i]));
  }
  const total = distances[distances.length - 1];
  const target = t * total;

  for (let i = 1; i < coords.length; i++) {
    if (distances[i] >= target) {
      const segFraction =
        (target - distances[i - 1]) / (distances[i] - distances[i - 1]);
      return [
        coords[i - 1][0] + segFraction * (coords[i][0] - coords[i - 1][0]),
        coords[i - 1][1] + segFraction * (coords[i][1] - coords[i - 1][1]),
      ];
    }
  }
  return coords[coords.length - 1];
}

/**
 * Finds the nearest pothole that is ahead of the vehicle on the route.
 * Returns { distance, coords } or null if none within thresholdMetres.
 */
export function findNearestPotholeAhead(
  vehiclePos: [number, number],
  routeCoords: [number, number][],
  potholePositions: [number, number][],
  thresholdMetres = 500,
): { distance: number; coords: [number, number] } | null {
  const vehicleBearing = (() => {
    // approximate heading from vehicle's position to next route segment
    const closest = routeCoords
      .map((c, i) => ({ dist: haversineDistance(vehiclePos, c), i }))
      .sort((a, b) => a.dist - b.dist)[0];
    const nextIdx = Math.min(closest.i + 1, routeCoords.length - 1);
    return bearing(routeCoords[closest.i], routeCoords[nextIdx]);
  })();

  let best: { distance: number; coords: [number, number] } | null = null;

  for (const ph of potholePositions) {
    const dist = haversineDistance(vehiclePos, ph);
    if (dist > thresholdMetres) continue;

    // Check if pothole is ahead (bearing within ±90°)
    const b = bearing(vehiclePos, ph);
    const diff = Math.abs(((b - vehicleBearing + 540) % 360) - 180);
    if (diff > 90) continue;

    if (!best || dist < best.distance) {
      best = { distance: dist, coords: ph };
    }
  }
  return best;
}