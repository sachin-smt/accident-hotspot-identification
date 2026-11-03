import { AlertTriangle, Car, Layers, MapPin, Search, Download, BarChart3 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MetricCard } from '../components/common/MetricCard';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { StateMessage } from '../components/common/StateMessage';
import { HotspotMap } from '../components/maps/HotspotMap';
import { HotspotTable } from '../components/tables/HotspotTable';
import { useHotspots } from '../hooks/useHotspots';
import { exportHotspotsCsv } from '../utils/csvExport';
import { cityAggregates } from '../utils/risk';

export function Dashboard() {
  const { hotspots, totals, loading, error } = useHotspots();
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => hotspots.filter((row) => `${row.city} ${row.clusterId}`.toLowerCase().includes(search.toLowerCase())).slice(0, 5), [hotspots, search]);
  const cities = cityAggregates(hotspots).slice(0, 5);
  return <><PageHeader icon={BarChart3} title="Dashboard" subtitle="AI-powered overview of accident hotspot patterns across India" />{error && <StateMessage kind="error" message={error} />}{loading ? <StateMessage kind="loading" message="Loading hotspot data…" /> : <><div className="metric-grid"><MetricCard tone="red" icon={Car} label="Total Accident Records" value="Unavailable" helper="Not exposed by API" /><MetricCard tone="purple" icon={Layers} label="Identified Hotspots" value={totals.hotspots} helper="DBSCAN clusters" /><MetricCard tone="green" icon={MapPin} label="Cities Covered" value={totals.cities} helper={Object.keys(cityAggregates(hotspots).reduce<Record<string, boolean>>((a, x) => ({ ...a, [x.city]: true }), {})).join(', ')} /><MetricCard tone="orange" icon={AlertTriangle} label="Noise Records" value="Unavailable" helper="Not exposed by API" /></div>{hotspots.length === 0 ? <StateMessage kind="empty" message="No hotspot data is available from the backend." /> : <><div className="dashboard-grid"><Panel title="Accident Hotspot Map (India)" icon={<MapPin size={20} />} className="map-panel"><HotspotMap hotspots={hotspots} onSelect={() => undefined} height="410px" /></Panel><div className="stack-panels"><Panel title="Accident Severity Distribution" icon={<BarChart3 size={18} />}><div className="unavailable compact-unavailable"><strong>Unavailable from current API</strong><span>Only fatal hotspot counts are provided; complete severity records are not exposed.</span></div></Panel><Panel title="Top Cities by Clustered Accidents" icon={<BarChart3 size={18} />}><div className="ranking">{cities.map((city, index) => <div key={city.city}><span>{index + 1}. {city.city}</span><i><b style={{ width: `${city.accidents / Math.max(cities[0]?.accidents ?? 1, 1) * 100}%` }} /></i><strong>{city.accidents.toLocaleString()}</strong></div>)}</div></Panel></div></div><Panel title="Hotspot Summary (Top Records)" icon={<MapPin size={18} />}><div className="table-toolbar"><label className="search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search city or cluster..." /></label><button className="primary-button" onClick={() => exportHotspotsCsv(filtered)}><Download size={15} /> Export CSV</button></div><HotspotTable rows={filtered} compact /></Panel></>}</>}</>;
}
