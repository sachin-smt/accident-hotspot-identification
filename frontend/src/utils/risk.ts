import type { Hotspot, RiskLevel } from '../types/hotspot';

export function riskLevel(score: number): RiskLevel {
  if (score >= 0.7) return 'High';
  if (score >= 0.5) return 'Medium';
  return 'Low';
}

export function riskClass(score: number): string {
  return riskLevel(score).toLowerCase();
}

export function cityAggregates(hotspots: Hotspot[]) {
  const byCity = new Map<string, Hotspot[]>();
  hotspots.forEach((hotspot) => {
    const items = byCity.get(hotspot.city) ?? [];
    items.push(hotspot);
    byCity.set(hotspot.city, items);
  });
  return [...byCity.entries()]
    .map(([city, items]) => {
      const accidents = items.reduce((sum, item) => sum + item.accidentCount, 0);
      return {
        city,
        hotspots: items.length,
        accidents,
        fatal: items.reduce((sum, item) => sum + item.fatalRecords, 0),
        casualties: items.reduce((sum, item) => sum + item.totalCasualties, 0),
        averageRisk:
          accidents === 0
            ? 0
            : items.reduce((sum, item) => sum + item.avgRiskScore * item.accidentCount, 0) /
              accidents,
      };
    })
    .sort((a, b) => b.accidents - a.accidents);
}
