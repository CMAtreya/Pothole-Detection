import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, type AppState } from '@/store/useAppStore';
import { geocode } from '@/utils/nominatim';
import { getRoute } from '@/utils/osrm';

export default function RouteForm() {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState<string | null>(null);

  const {
    setRouteRequest, setRouteResult, setRoutingLoading,
    isRoutingLoading, vehicle, setVehicle, showAlert,
  } = useAppStore((s: AppState) => ({
    setRouteRequest: s.setRouteRequest,
    setRouteResult: s.setRouteResult,
    setRoutingLoading: s.setRoutingLoading,
    isRoutingLoading: s.isRoutingLoading,
    vehicle: s.vehicle,
    setVehicle: s.setVehicle,
    showAlert: s.showAlert,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!start.trim() || !destination.trim()) return;
    setError(null);
    setRoutingLoading(true);

    try {
      const [startCoords, destCoords] = await Promise.all([
        geocode(start),
        geocode(destination),
      ]);
      const result = await getRoute(startCoords, destCoords);
      setRouteRequest({ start, destination });
      setRouteResult(result);
      setVehicle({ position: result.coordinates[0], progress: 0, running: false });
      showAlert('Route loaded. Press Start to simulate.', 'info');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Routing failed.';
      setError(msg);
    } finally {
      setRoutingLoading(false);
    }
  };

  const handleSimulationToggle = () => {
    setVehicle({ running: !vehicle.running });
  };

  const inputClass = `
    w-full px-3 py-2 rounded-lg text-sm
    bg-[var(--color-surface-2)] border border-[var(--color-border)]
    text-[var(--color-text)] placeholder:text-[var(--color-text-faint)]
    focus:outline-none focus:border-[var(--color-primary)]
    transition-colors duration-150
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Start (place name or lat,lng)"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className={inputClass}
          aria-label="Start location"
          autoComplete="off"
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className={inputClass}
          aria-label="Destination"
          autoComplete="off"
        />
      </div>

      {error && (
        <p className="text-xs text-[var(--color-error)]" role="alert">{error}</p>
      )}

      <div className="flex gap-2">
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={isRoutingLoading}
          className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold
                     bg-[var(--color-primary)] text-[var(--color-text-inverse)]
                     hover:bg-[var(--color-primary-hover)] disabled:opacity-50
                     transition-colors duration-150"
        >
          {isRoutingLoading ? 'Finding Route…' : 'Get Route'}
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={handleSimulationToggle}
          disabled={!useAppStore.getState().routeResult}
          className={`
            flex-1 py-2 px-3 rounded-lg text-xs font-semibold
            transition-colors duration-150 disabled:opacity-40
            ${vehicle.running
              ? 'bg-[var(--color-warning)] text-[var(--color-text-inverse)] hover:bg-[var(--color-warning-hover)]'
              : 'bg-[var(--color-surface-dynamic)] text-[var(--color-text)] hover:bg-[var(--color-surface-offset-2)]'
            }
          `}
        >
          {vehicle.running ? 'Stop' : 'Start'}
        </motion.button>
      </div>
    </form>
  );
}