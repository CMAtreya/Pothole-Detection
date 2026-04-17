import { useEffect, useRef, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polyline,
  Tooltip,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '@/store/useAppStore';
import VehicleMarker from './VehicleMarker';
import type { RoadEvent, PredictionResult } from '@/types';
import axios from 'axios';

// ── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_CENTER: [number, number] = [12.9716, 77.5946]; // Bengaluru
const DEFAULT_ZOOM = 13;

const EVENT_COLORS: Record<RoadEvent['type'], string> = {
  pothole:  '#da7101',
  crash:    '#a12c7b',
  safe_road: '#437a22',
  alert:    '#d19900',
};

const EVENT_RADII: Record<RoadEvent['type'], number> = {
  pothole:  7,
  crash:    8,
  safe_road: 6,
  alert:    7,
};

// ── Heatmap layer (imperative Leaflet) ───────────────────────────────────────
function HeatmapLayer({ events }: { events: RoadEvent[] }) {
  const map = useMap();
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (layerRef.current) layerRef.current.clearLayers();
    else {
      layerRef.current = L.layerGroup().addTo(map);
    }

    const heatPoints = events
      .filter((e) => e.type === 'pothole' || e.type === 'crash')
      .map((e) => [e.lat, e.lng, e.confidence] as [number, number, number]);

    heatPoints.forEach(([lat, lng, intensity]) => {
      L.circle([lat, lng], {
        radius: 60,
        fillColor: intensity > 0.7 ? '#a12c7b' : '#da7101',
        fillOpacity: 0.08 * intensity,
        stroke: false,
      }).addTo(layerRef.current!);
    });

    return () => {
      layerRef.current?.clearLayers();
    };
  }, [map, events]);

  return null;
}

// ── Predicted Risk Zones layer ────────────────────────────────────────────────
function RiskZonesLayer({
  events,
  cache,
  setPrediction,
}: {
  events: RoadEvent[];
  cache: Record<string, PredictionResult>;
  setPrediction: (id: string, r: PredictionResult) => void;
}) {
  useEffect(() => {
    events.forEach(async (event) => {
      if (cache[event.id]) return; // already cached
      try {
        const { data } = await axios.post<PredictionResult>('/api/predict', {
          lat: event.lat,
          lng: event.lng,
          type: event.type,
          confidence: event.confidence,
        });
        setPrediction(event.id, data);
      } catch {
        // ignore prediction failures
      }
    });
  }, [events, cache, setPrediction]);

  return (
    <>
      {events.map((event) => {
        const pred = cache[event.id];
        if (!pred) return null;
        return (
          <CircleMarker
            key={`risk-${event.id}`}
            center={[event.lat, event.lng]}
            radius={Math.min(pred.radiusMeters / 5, 40)}
            pathOptions={{
              fillColor: pred.label === 'risky' ? '#a12c7b' : '#437a22',
              fillOpacity: 0.15,
              color: pred.label === 'risky' ? '#a12c7b' : '#437a22',
              weight: 1,
              dashArray: '4 4',
            }}
          >
            <Tooltip direction="top" sticky>
              {pred.label === 'risky' ? '⚠ Risky Zone' : '✓ Safe Zone'}
              {' '}— {(pred.riskScore * 100).toFixed(0)}% risk
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}

// ── Main MapView component ────────────────────────────────────────────────────
export default function MapView() {
  const {
    filteredEvents,
    latestPothole,
    routeResult,
    vehicle,
    showPredictedRiskZones,
    predictionCache,
    setPrediction,
    events,
  } = useAppStore((s) => ({
    filteredEvents: s.filteredEvents(),
    latestPothole: s.latestPothole,
    routeResult: s.routeResult,
    vehicle: s.vehicle,
    showPredictedRiskZones: s.showPredictedRiskZones,
    predictionCache: s.predictionCache,
    setPrediction: s.setPrediction,
    events: s.events,
  }));

  // Compute traveled portion of route
  const traveledCoords = useMemo(() => {
    if (!routeResult || vehicle.progress === 0) return [];
    const totalPts = routeResult.coordinates.length;
    const upTo = Math.floor(vehicle.progress * totalPts);
    return routeResult.coordinates.slice(0, upTo + 1);
  }, [routeResult, vehicle.progress]);

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      zoomControl={false}
      attributionControl={false}
      className="w-full h-dvh z-0"
    >
      {/* OpenStreetMap tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        maxZoom={19}
      />

      {/* Attribution (bottom right) */}
      <div className="leaflet-bottom leaflet-right">
        <div className="leaflet-control leaflet-attribution" style={{ fontSize: '10px' }}>
          © OpenStreetMap contributors
        </div>
      </div>

      {/* Zoom control (bottom right) */}
      {/* Using Leaflet's default — placed by MapContainer */}

      {/* Heatmap */}
      <HeatmapLayer events={events} />

      {/* Event markers */}
      {filteredEvents.map((event) => {
        const isLatestPothole = latestPothole?.id === event.id;
        const radius = isLatestPothole ? 12 : EVENT_RADII[event.type];
        const color = EVENT_COLORS[event.type];

        return (
          <CircleMarker
            key={event.id}
            center={[event.lat, event.lng]}
            radius={radius}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.85,
              color: isLatestPothole ? '#ffffff' : color,
              weight: isLatestPothole ? 2.5 : 1.5,
            }}
          >
            <Tooltip
              direction="top"
              permanent={isLatestPothole}
              offset={[0, -8]}
            >
              <span className="text-xs font-medium">
                {isLatestPothole && '📍 '}
                <strong>{event.type.replace('_', ' ')}</strong>
                {event.description && ` — ${event.description}`}
                <br />
                Conf: {(event.confidence * 100).toFixed(0)}%
                {event.severity && ` · ${event.severity}`}
              </span>
            </Tooltip>
          </CircleMarker>
        );
      })}

      {/* Pothole-ahead warning tooltip near vehicle */}
      {vehicle.position && vehicle.nearbyPotholeWarning && (
        <CircleMarker
          center={vehicle.position}
          radius={0}
          pathOptions={{ opacity: 0, fillOpacity: 0 }}
        >
          <Tooltip direction="top" permanent offset={[0, -20]}>
            <span className="text-xs font-semibold text-orange-600">
              ⚠ {vehicle.nearbyPotholeWarning}
            </span>
          </Tooltip>
        </CircleMarker>
      )}

      {/* Full route polyline */}
      {routeResult && (
        <Polyline
          positions={routeResult.coordinates}
          pathOptions={{ color: 'var(--color-primary)', weight: 4, opacity: 0.35 }}
        />
      )}

      {/* Traveled route polyline */}
      {traveledCoords.length > 1 && (
        <Polyline
          positions={traveledCoords}
          pathOptions={{ color: 'var(--color-primary)', weight: 5, opacity: 0.85 }}
        />
      )}

      {/* Predicted risk zones (toggled via store) */}
      {showPredictedRiskZones && (
        <RiskZonesLayer
          events={events}
          cache={predictionCache}
          setPrediction={setPrediction}
        />
      )}

      {/* Moving vehicle marker */}
      <VehicleMarker />
    </MapContainer>
  );
}