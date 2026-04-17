import { motion } from 'framer-motion';

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;        // Tailwind text color class
  bgClass: string;           // Tailwind bg class for icon box
  delay?: number;
}

export default function StatsCard({
  label, value, icon, colorClass, bgClass, delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 rounded-lg p-3
                 bg-[var(--color-surface-offset)] border border-[var(--color-border)]"
    >
      <div className={`p-2 rounded-md ${bgClass}`}>
        <span className={colorClass}>{icon}</span>
      </div>
      <div>
        <p className="text-[var(--color-text-muted)] text-xs leading-tight">{label}</p>
        <p className={`tabular-nums text-lg font-semibold leading-tight ${colorClass}`}>
          {value.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}