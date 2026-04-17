import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

export default function LivePotholeCard() {
  const latestPothole = useAppStore((s) => s.latestPothole);

  return (
    <div className="rounded-lg border border-[var(--color-border)]
                    bg-[var(--color-surface-offset)] overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--color-divider)]">
        {/* Live pulse indicator */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full
                           bg-[var(--color-notification)] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2
                           bg-[var(--color-notification)]" />
        </span>
        <p className="text-xs font-semibold text-[var(--color-text)] tracking-wide uppercase">
          Latest Pothole
        </p>
      </div>

      <AnimatePresence mode="wait">
        {latestPothole ? (
          <motion.div
            key={latestPothole.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="px-3 py-2 space-y-1"
          >
            <p className="tabular-nums text-xs text-[var(--color-text-muted)] font-mono">
              {latestPothole.lat.toFixed(5)}, {latestPothole.lng.toFixed(5)}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-xs text-[var(--color-text-faint)]">Conf.</span>
                <span className="tabular-nums text-xs font-semibold text-[var(--color-warning)]">
                  {(latestPothole.confidence * 100).toFixed(1)}%
                </span>
              </div>
              {latestPothole.severity && (
                <span className={`
                  text-xs px-2 py-0.5 rounded-full font-medium
                  ${latestPothole.severity === 'high'
                    ? 'bg-[var(--color-error-highlight)] text-[var(--color-error)]'
                    : latestPothole.severity === 'medium'
                      ? 'bg-[var(--color-warning-highlight)] text-[var(--color-warning)]'
                      : 'bg-[var(--color-surface-dynamic)] text-[var(--color-text-muted)]'
                  }
                `}>
                  {latestPothole.severity}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--color-text-faint)]">
              {new Date(latestPothole.timestamp).toLocaleTimeString()}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-3 py-3"
          >
            <p className="text-xs text-[var(--color-text-faint)] italic">
              No potholes detected yet.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}