import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import StatsCard from './StatsCard';
import FilterChips from './FilterChips';
import RouteForm from './RouteForm';
import LivePotholeCard from './LivePotholeCard';

// ── SVG Icons ────────────────────────────────────────────────────────────────
const PotholeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
    <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" opacity="0.5"/>
  </svg>
);
const CrashIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
  </svg>
);
const AlertIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
  </svg>
);
const SafeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
);
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-0' : 'rotate-180'}`}
    viewBox="0 0 20 20" fill="currentColor"
  >
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
  </svg>
);

export default function Dashboard() {
  const { stats, isPanelOpen, togglePanel, showPredictedRiskZones, toggleRiskZones } =
    useAppStore((s) => ({
      stats: s.stats,
      isPanelOpen: s.isPanelOpen,
      togglePanel: s.togglePanel,
      showPredictedRiskZones: s.showPredictedRiskZones,
      toggleRiskZones: s.toggleRiskZones,
    }));

  return (
    <div
      className="fixed top-4 left-4 z-[1000] w-72"
      style={{ maxHeight: 'calc(100dvh - 2rem)', overflowY: 'auto' }}
    >
      {/* ── Header bar ── */}
      <div className="glass-panel rounded-xl overflow-hidden">
        {/* Brand header */}
        <div className="flex items-center justify-between px-4 py-3
                        border-b border-[var(--color-divider)]">
          <div className="flex items-center gap-2">
            {/* Inline SVG logo */}
            <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none" aria-label="UrbanGuard">
              <rect width="28" height="28" rx="7" fill="var(--color-primary)" />
              <path d="M5 20 L10 8 L14 14 L18 6 L23 20Z"
                    fill="var(--color-text-inverse)" opacity="0.9" />
              <circle cx="14" cy="20" r="2.2" fill="#fbbf24" />
            </svg>
            <div>
              <p className="text-sm font-bold text-[var(--color-text)] leading-tight">UrbanGuard</p>
              <p className="text-xs text-[var(--color-text-faint)] leading-tight">Road Monitor</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Risk zones toggle */}
            <button
              onClick={toggleRiskZones}
              title="Toggle predicted risk zones"
              aria-pressed={showPredictedRiskZones}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors duration-150
                ${showPredictedRiskZones
                  ? 'bg-[var(--color-warning-highlight)] text-[var(--color-warning)]'
                  : 'text-[var(--color-text-faint)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-dynamic)]'
                }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
            </button>

            {/* Collapse toggle */}
            <button
              onClick={togglePanel}
              aria-label={isPanelOpen ? 'Collapse panel' : 'Expand panel'}
              className="p-1.5 rounded-lg text-[var(--color-text-faint)]
                         hover:text-[var(--color-text)] hover:bg-[var(--color-surface-dynamic)]
                         transition-colors duration-150"
            >
              <ChevronIcon open={isPanelOpen} />
            </button>
          </div>
        </div>

        {/* ── Collapsible body ── */}
        <AnimatePresence initial={false}>
          {isPanelOpen && (
            <motion.div
              key="panel-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="p-3 space-y-4">
                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2">
                  <StatsCard
                    label="Potholes"
                    value={stats.potholes}
                    icon={<PotholeIcon />}
                    colorClass="text-[var(--color-orange)]"
                    bgClass="bg-[var(--color-orange-highlight)]"
                    delay={0}
                  />
                  <StatsCard
                    label="Crashes"
                    value={stats.crashes}
                    icon={<CrashIcon />}
                    colorClass="text-[var(--color-error)]"
                    bgClass="bg-[var(--color-error-highlight)]"
                    delay={0.05}
                  />
                  <StatsCard
                    label="Alerts"
                    value={stats.alerts}
                    icon={<AlertIcon />}
                    colorClass="text-[var(--color-warning)]"
                    bgClass="bg-[var(--color-warning-highlight)]"
                    delay={0.1}
                  />
                  <StatsCard
                    label="Safe Points"
                    value={stats.safePoints}
                    icon={<SafeIcon />}
                    colorClass="text-[var(--color-success)]"
                    bgClass="bg-[var(--color-success-highlight)]"
                    delay={0.15}
                  />
                </div>

                {/* Divider */}
                <hr className="border-[var(--color-divider)]" />

                {/* Filters */}
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)]
                                 uppercase tracking-wide mb-2">
                    Filter Events
                  </p>
                  <FilterChips />
                </div>

                {/* Route form */}
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)]
                                 uppercase tracking-wide mb-2">
                    Route Planner
                  </p>
                  <RouteForm />
                </div>

                {/* Live pothole card */}
                <LivePotholeCard />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
