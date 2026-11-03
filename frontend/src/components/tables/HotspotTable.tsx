import { Eye } from 'lucide-react';
import type { Hotspot } from '../../types/hotspot';
import { riskLevel } from '../../utils/risk';

interface Props { rows: Hotspot[]; onSelect?: (row: Hotspot) => void; compact?: boolean }
export function HotspotTable({ rows, onSelect, compact = false }: Props) {
  return <div className="table-wrap"><table className={compact ? 'compact' : ''}><thead><tr><th>#</th><th>City</th><th>Cluster ID</th><th>Accident Count</th><th>Fatal Records</th><th>Casualties</th><th>Avg Risk</th><th>Location</th><th>Risk</th><th>Action</th></tr></thead><tbody>{rows.map((row, index) => <tr key={`${row.city}-${row.clusterId}`}><td>{index + 1}</td><td>{row.city}</td><td>{row.clusterId}</td><td>{row.accidentCount.toLocaleString()}</td><td>{row.fatalRecords.toLocaleString()}</td><td>{row.totalCasualties.toLocaleString()}</td><td>{row.avgRiskScore.toFixed(3)}</td><td>{row.latitude.toFixed(4)}, {row.longitude.toFixed(4)}</td><td><span className={`risk ${riskLevel(row.avgRiskScore).toLowerCase()}`}>{riskLevel(row.avgRiskScore)}</span></td><td><button className="icon-button" onClick={() => onSelect?.(row)}><Eye size={15} /> View</button></td></tr>)}</tbody></table></div>;
}
