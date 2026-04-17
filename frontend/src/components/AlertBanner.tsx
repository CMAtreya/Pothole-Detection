import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const severityStyles = {
  info:    'bg-[var(--color-blue-highlight)]    border-[var(--color-blue)]    text-[var(--color-text)]',
  warning: 'bg-[var(--color-warning-highlight)] border-[var(--color-warning)] text-[var(--color-text)]',
  danger:  'bg-[var(--color-error-highlight)]   border-[var(--color-error)]   text-[var(--color-text)]',
};

const severityIcons = {
  info: (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
    </svg>
  ),
  danger: (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
    </svg>
  ),
};

export default function AlertBannerComponent() {
  const { alertBanner, dismissAlert } = useAppStore((s) => ({
    alertBanner: s.alertBanner,
    dismissAlert: s.dismissAlert,
  }));

  return (
    <AnimatePresence>
      {alertBanner.visible && (
        <motion.div
          key={alertBanner.message}
          initial={{ opacity: 0, y: -24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className={`
            fixed top-4 left-1/2 -translate-x-1/2 z-[1200]
            flex items-center gap-3 px-4 py-3
            rounded-xl border text-sm font-medium
            shadow-lg max-w-sm w-full mx-4
            ${severityStyles[alertBanner.severity]}
          `}
          role="alert"
          aria-live="assertive"
        >
          {severityIcons[alertBanner.severity]}
          <span className="flex-1">{alertBanner.message}</span>
          <button
            onClick={dismissAlert}
            className="ml-1 p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dismiss alert"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}