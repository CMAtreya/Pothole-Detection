import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { findNearestPotholeAhead } from '@/utils/geo';

/**
 * Computes real-time pothole-ahead warning while vehicle is running.
 */
export function usePotholeWarning() {
  const vehicle = useAppStore((s) => s.vehicle);
  const events = useAppStore((s) => s.events);
  const routeResult = useAppStore((s) => s.routeResult);
  const setVehicle = useAppStore((s) => s.setVehicle);
  const showAlert = useAppStore((s) => s.showAlert);
  const lastWarnRef = useRef<string | null>(null);

  useEffect(() => {
    if (!vehicle.running || !vehicle.position || !routeResult) {
      setVehicle({ nearbyPotholeDistance: null, nearbyPotholeWarning: null });
      return;
    }

    const potholes = events
      .filter((e) => e.type === 'pothole')
      .map((e) => [e.lat, e.lng] as [number, number]);

    const nearest = findNearestPotholeAhead(
      vehicle.position,
      routeResult.coordinates,
      potholes,
      400,
    );

    if (nearest) {
      const distRounded = Math.round(nearest.distance);
      const msg = `Go slow. Pothole ahead (~${distRounded}m)`;
      setVehicle({
        nearbyPotholeDistance: nearest.distance,
        nearbyPotholeWarning: msg,
      });
      if (lastWarnRef.current !== msg) {
        showAlert(msg, 'warning');
        lastWarnRef.current = msg;
      }
    } else {
      if (lastWarnRef.current) lastWarnRef.current = null;
      setVehicle({ nearbyPotholeDistance: null, nearbyPotholeWarning: null });
    }
  }, [vehicle.position, vehicle.running, events, routeResult, setVehicle, showAlert]);
}