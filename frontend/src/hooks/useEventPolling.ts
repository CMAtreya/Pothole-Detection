import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useAppStore } from '@/store/useAppStore';
import type { RoadEvent } from '@/types';

const POLL_INTERVAL_MS = 2000;

export function useEventPolling() {
  const setEvents = useAppStore((s) => s.setEvents);
  const showAlert = useAppStore((s) => s.showAlert);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get<RoadEvent[]>('/api/events');
        setEvents(data);
      } catch {
        // Silently ignore network errors during polling
      }
    };

    // Immediate first fetch
    fetchEvents();

    intervalRef.current = setInterval(fetchEvents, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [setEvents, showAlert]);
}