// ─── Domain Types ─────────────────────────────────────────────────────────────

export type EventType = 'pothole' | 'crash' | 'safe_road' | 'alert';

export interface RoadEvent {
  id: string;
  type: EventType;
  lat: number;
  lng: number;
  confidence: number;          // 0–1
  timestamp: string;           // ISO-8601
  description?: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface RouteRequest {
  start: string;               // place name or "lat,lng"
  destination: string;
}

export interface RouteResult {
  coordinates: [number, number][];   // [lat, lng] pairs
  distanceMeters: number;
  durationSeconds: number;
}

export interface PredictionResult {
  eventId: string;
  riskScore: number;           // 0–1
  label: 'safe' | 'risky';
  radiusMeters: number;
}

export type FilterType = 'all' | 'pothole' | 'crash' | 'safe_road';

export interface DashboardStats {
  potholes: number;
  crashes: number;
  alerts: number;
  safePoints: number;
}

export interface AlertBanner {
  message: string;
  severity: 'info' | 'warning' | 'danger';
  visible: boolean;
}

export interface VehicleState {
  position: [number, number] | null;
  progress: number;            // 0–1 along route
  running: boolean;
  nearbyPotholeDistance: number | null;
  nearbyPotholeWarning: string | null;
}

export type PredictionCache = Record<string, PredictionResult>;