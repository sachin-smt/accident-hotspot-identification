import { Activity, AlertTriangle, Crosshair, Layers, MapPin, Users } from 'lucide-react';
import type { Hotspot } from '../../types/hotspot';
export function SelectedHotspot({ hotspot }: { hotspot?: Hotspot }) {
  if (!hotspot) return <div className="selected-card"><strong>Select a marker</strong><span>Choose a hotspot to inspect its summary.</span></div>;
  const fields = [[MapPin, 'City', hotspot.city], [Layers, 'Cluster ID', hotspot.clusterId], [Activity, 'Accident Count', hotspot.accidentCount.toLocaleString()], [AlertTriangle, 'Fatal Records', hotspot.fatalRecords.toLocaleString()], [Users, 'Total Casualties', hotspot.totalCasualties.toLocaleString()], [Activity, 'Average Risk Score', hotspot.avgRiskScore.toFixed(3)], [Crosshair, 'Latitude', hotspot.latitude.toFixed(6)], [Crosshair, 'Longitude', hotspot.longitude.toFixed(6)]] as const;
  return <div className="selected-card"><div className="selected-title"><MapPin size={20} /> Selected Hotspot</div>{fields.map(([Icon, label, value]) => <div className="detail-row" key={label}><Icon size={16} /><span>{label}</span><b>{value}</b></div>)}</div>;
}
