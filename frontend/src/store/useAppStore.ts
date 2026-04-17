import { create } from 'zustand';
import type {
  RoadEvent,
  FilterType,
  RouteRequest,
  RouteResult,
  PredictionResult,
  AlertBanner,
  DashboardStats,
  VehicleState,
  PredictionCache,
} from '@/types';

export interface AppState {
  // ── Events ──────────────────────────────────────────────────────────────────
  events: RoadEvent[];
  setEvents: (events: RoadEvent[]) => void;
  addEvent: (event: RoadEvent) => void;

  // ── Filter ───────────────────────────────────────────────────────────────────
  activeFilter: FilterType;
  setFilter: (filter: FilterType) => void;
  filteredEvents: () => RoadEvent[];

  // ── Latest Pothole ────────────────────────────────────────────────────────────
  latestPothole: RoadEvent | null;

  // ── Route ─────────────────────────────────────────────────────────────────────
  routeRequest: RouteRequest | null;
  setRouteRequest: (req: RouteRequest | null) => void;
  routeResult: RouteResult | null;
  setRouteResult: (res: RouteResult | null) => void;
  isRoutingLoading: boolean;
  setRoutingLoading: (v: boolean) => void;

  // ── Alert Banner ──────────────────────────────────────────────────────────────
  alertBanner: AlertBanner;
  showAlert: (message: string, severity: AlertBanner['severity']) => void;
  dismissAlert: () => void;

  // ── Dashboard Stats ───────────────────────────────────────────────────────────
  stats: DashboardStats;

  // ── Vehicle Simulation ────────────────────────────────────────────────────────
  vehicle: VehicleState;
  setVehicle: (patch: Partial<VehicleState>) => void;

  // ── Panel Visibility ──────────────────────────────────────────────────────────
  isPanelOpen: boolean;
  togglePanel: () => void;

  // ── Predicted Risk Zones ──────────────────────────────────────────────────────
  showPredictedRiskZones: boolean;
  toggleRiskZones: () => void;
  predictionCache: PredictionCache;
  setPrediction: (eventId: string, result: PredictionResult) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // ── Events ───────────────────────────────────────────────────────────────────
  events: [],
  setEvents: (events) => {
    const latestPothole =
      [...events]
        .filter((e) => e.type === 'pothole')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] ?? null;

    const stats: DashboardStats = {
      potholes: events.filter((e) => e.type === 'pothole').length,
      crashes: events.filter((e) => e.type === 'crash').length,
      alerts: events.filter((e) => e.type === 'alert').length,
      safePoints: events.filter((e) => e.type === 'safe_road').length,
    };

    set({ events, latestPothole, stats });
  },
  addEvent: (event) => {
    const events = [event, ...get().events];
    get().setEvents(events);
  },

  // ── Filter ───────────────────────────────────────────────────────────────────
  activeFilter: 'all',
  setFilter: (filter) => set({ activeFilter: filter }),
  filteredEvents: () => {
    const { events, activeFilter } = get();
    if (activeFilter === 'all') return events;
    return events.filter((e) => e.type === activeFilter);
  },

  // ── Latest Pothole ────────────────────────────────────────────────────────────
  latestPothole: null,

  // ── Route ─────────────────────────────────────────────────────────────────────
  routeRequest: null,
  setRouteRequest: (req) => set({ routeRequest: req }),
  routeResult: null,
  setRouteResult: (res) => set({ routeResult: res }),
  isRoutingLoading: false,
  setRoutingLoading: (v) => set({ isRoutingLoading: v }),

  // ── Alert Banner ──────────────────────────────────────────────────────────────
  alertBanner: { message: '', severity: 'info', visible: false },
  showAlert: (message, severity) =>
    set({ alertBanner: { message, severity, visible: true } }),
  dismissAlert: () =>
    set((s) => ({ alertBanner: { ...s.alertBanner, visible: false } })),

  // ── Stats ─────────────────────────────────────────────────────────────────────
  stats: { potholes: 0, crashes: 0, alerts: 0, safePoints: 0 },

  // ── Vehicle ───────────────────────────────────────────────────────────────────
  vehicle: {
    position: null,
    progress: 0,
    running: false,
    nearbyPotholeDistance: null,
    nearbyPotholeWarning: null,
  },
  setVehicle: (patch) =>
    set((s) => ({ vehicle: { ...s.vehicle, ...patch } })),

  // ── Panel ─────────────────────────────────────────────────────────────────────
  isPanelOpen: true,
  togglePanel: () => set((s) => ({ isPanelOpen: !s.isPanelOpen })),

  // ── Risk Zones ────────────────────────────────────────────────────────────────
  showPredictedRiskZones: false,
  toggleRiskZones: () =>
    set((s) => ({ showPredictedRiskZones: !s.showPredictedRiskZones })),
  predictionCache: {},
  setPrediction: (eventId, result) =>
    set((s) => ({
      predictionCache: { ...s.predictionCache, [eventId]: result },
    })),
}));