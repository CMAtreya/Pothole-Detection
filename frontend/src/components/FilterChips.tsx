import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import type { FilterType } from '@/types';

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all',       label: 'All Events' },
  { value: 'pothole',   label: 'Potholes' },
  { value: 'crash',     label: 'Crashes' },
  { value: 'safe_road', label: 'Safe Roads' },
];

export default function FilterChips() {
  const { activeFilter, setFilter } = useAppStore((s) => ({
    activeFilter: s.activeFilter,
    setFilter: s.setFilter,
  }));

  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Event filter">
      {FILTERS.map(({ value, label }) => {
        const isActive = activeFilter === value;
        return (
          <motion.button
            key={value}
            whileTap={{ scale: 0.96 }}
            onClick={() => setFilter(value)}
            className={`
              relative px-3 py-1 rounded-full text-xs font-medium
              transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-[var(--color-primary)]
              ${isActive
                ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)]'
                : 'bg-[var(--color-surface-dynamic)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }
            `}
            aria-pressed={isActive}
          >
            {label}
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-[var(--color-primary)] -z-10"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}