import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useEventPolling } from '@/hooks/useEventPolling';
import { usePotholeWarning } from '@/hooks/usePothole';
import MapView from '@/components/MapView';
import Dashboard from '@/components/Dashboard';
import AlertBannerComponent from '@/components/AlertBanner';

export default function App() {
  // Start live polling
  useEventPolling();
  // Start pothole-ahead warning detection
  usePotholeWarning();

  const alertBanner = useAppStore((s) => s.alertBanner);
  const dismissAlert = useAppStore((s) => s.dismissAlert);

  // Auto-dismiss alerts after 5 s
  useEffect(() => {
    if (!alertBanner.visible) return;
    const t = setTimeout(dismissAlert, 5000);
    return () => clearTimeout(t);
  }, [alertBanner.visible, alertBanner.message, dismissAlert]);

  return (
    <div className="relative w-full h-dvh overflow-hidden">
      {/* Full-screen map layer */}
      <MapView />

      {/* Floating dashboard panel */}
      <Dashboard />

      {/* Alert banner */}
      <AlertBannerComponent />
    </div>
  );
}