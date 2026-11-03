import { Layers, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { StateMessage } from '../components/common/StateMessage';
import { HotspotMap } from '../components/maps/HotspotMap';
import { SelectedHotspot } from '../components/maps/SelectedHotspot';
import { useHotspots } from '../hooks/useHotspots';
import { riskLevel } from '../utils/risk';

export function HotspotMapPage() {
  const { hotspots, cities, totals, loading, error } = useHotspots();
  const [city, setCity] = useState('All Cities');
  const [risk, setRisk] = useState('All Risk Levels');
  const [selected, setSelected] = useState(hotspots[0]);
  const filtered = hotspots.filter((item) => (city === 'All Cities' || item.city === city) && (risk === 'All Risk Levels' || riskLevel(item.avgRiskScore) === risk));
  useEffect(() => {
    if (filtered.length > 0 && !filtered.some((item) => item.id === selected?.id)) setSelected(filtered[0]);
  }, [filtered, selected?.id]);
  return <><PageHeader icon={MapPin} title="Accident Hotspot Map" subtitle="Geospatial visualization of accident-prone locations across India" />{error && <StateMessage kind="error" message={error} />}{loading ? <StateMessage kind="loading" message="Loading map data…" /> : <><div className="filter-bar"><label>City<select value={city} onChange={(event) => setCity(event.target.value)}><option>All Cities</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label><label>Risk level<select value={risk} onChange={(event) => setRisk(event.target.value)}><option>All Risk Levels</option><option>High</option><option>Medium</option><option>Low</option></select></label><button className="secondary-button"><Layers size={16} /> Clusters</button></div>{filtered.length === 0 ? <StateMessage kind="empty" message="No hotspots match the selected filters." /> : <div className="map-layout"><Panel className="large-map"><HotspotMap hotspots={filtered} selected={selected} onSelect={setSelected} height="620px" /></Panel><div><div className="mini-metrics"><Metric title="Identified Hotspots" value={totals.hotspots} /><Metric title="Cities Covered" value={totals.cities} /></div><SelectedHotspot hotspot={selected ?? filtered[0]} /></div></div>}</>}</>;
}
function Metric({ title, value }: { title: string; value: number }) { return <div className="mini-metric"><Layers size={20} /><strong>{value}</strong><span>{title}</span></div>; }
