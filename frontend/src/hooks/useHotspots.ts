import { useEffect, useMemo, useState } from 'react';
import { fetchHotspots } from '../services/api';
import type { Hotspot } from '../types/hotspot';

export function useHotspots() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchHotspots(controller.signal)
      .then(setHotspots)
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return;
        setError(reason instanceof Error ? reason.message : 'Unable to load hotspot data.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const cities = useMemo(
    () => [...new Set(hotspots.map((hotspot) => hotspot.city))].sort(),
    [hotspots],
  );
  const totals = useMemo(
    () => ({
      hotspots: hotspots.length,
      cities: cities.length,
      clusteredAccidents: hotspots.reduce((sum, item) => sum + item.accidentCount, 0),
      fatalRecords: hotspots.reduce((sum, item) => sum + item.fatalRecords, 0),
      casualties: hotspots.reduce((sum, item) => sum + item.totalCasualties, 0),
      averageRisk:
        hotspots.length === 0
          ? 0
          : hotspots.reduce((sum, item) => sum + item.avgRiskScore, 0) / hotspots.length,
    }),
    [hotspots, cities.length],
  );

  return { hotspots, cities, totals, loading, error };
}
