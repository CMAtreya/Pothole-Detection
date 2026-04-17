import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '@/store/useAppStore';
import { interpolateRoute } from '@/utils/geo';

// SVG car icon
const CAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
  <circle cx="14" cy="14" r="12" fill="#01696f" stroke="white" stroke-width="2"/>
  <path d="M8 16l2-5h8l2 5H8z" fill="white"/>
  <circle cx="10.5" cy="17" r="1.5" fill="#fbbf24"/>
  <circle cx="17.5" cy="17" r="1.5" fill="#fbbf24"/>
</svg>`;

const vehicleIcon = L.divIcon({
  html: CAR_SVG,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const STEP_MS = 100;
const STEPS = 600; // 60 seconds simulation

export default function VehicleMarker() {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);
  const animFrameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { vehicle, setVehicle, routeResult } = useAppStore((s) => ({
    vehicle: s.vehicle,
    setVehicle: s.setVehicle,
    routeResult: s.routeResult,
  }));

  // Create / remove marker
  useEffect(() => {
    if (!routeResult) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      return;
    }
    if (!markerRef.current) {
      markerRef.current = L.marker(routeResult.coordinates[0], {
        icon: vehicleIcon,
        zIndexOffset: 1000,
      }).addTo(map);
    }
  }, [map, routeResult]);

  // Animate vehicle
  useEffect(() => {
    if (!vehicle.running || !routeResult) return;

    let step = Math.round(vehicle.progress * STEPS);

    const tick = () => {
      step += 1;
      if (step > STEPS) {
        setVehicle({ running: false, progress: 1 });
        return;
      }
      const t = step / STEPS;
      const pos = interpolateRoute(routeResult.coordinates, t);
      setVehicle({ position: pos, progress: t });
      if (markerRef.current) {
        markerRef.current.setLatLng(pos);
      }
      animFrameRef.current = setTimeout(tick, STEP_MS);
    };

    animFrameRef.current = setTimeout(tick, STEP_MS);
    return () => {
      if (animFrameRef.current) clearTimeout(animFrameRef.current);
    };
  }, [vehicle.running, routeResult, setVehicle]);

  return null; // Marker is managed imperatively via Leaflet
}