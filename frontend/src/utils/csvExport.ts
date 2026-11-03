import type { Hotspot } from '../types/hotspot';

export function exportHotspotsCsv(rows: Hotspot[]) {
  const header = ['city', 'clusterId', 'accidentCount', 'fatalRecords', 'totalCasualties', 'avgRiskScore', 'latitude', 'longitude'];
  const body = rows.map((row) =>
    [row.city, row.clusterId, row.accidentCount, row.fatalRecords, row.totalCasualties, row.avgRiskScore, row.latitude, row.longitude]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(','),
  );
  const blob = new Blob([[header.join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'hotspot-records.csv';
  link.click();
  URL.revokeObjectURL(url);
}
