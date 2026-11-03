import { AlertTriangle, Car, Download, Layers, List, MapPin, RotateCcw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MetricCard } from '../components/common/MetricCard';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { StateMessage } from '../components/common/StateMessage';
import { HotspotTable } from '../components/tables/HotspotTable';
import { useHotspots } from '../hooks/useHotspots';
import { exportHotspotsCsv } from '../utils/csvExport';

export function HotspotRecords() {
  const { hotspots, totals, cities, loading, error } = useHotspots();
  const [city, setCity] = useState('All Cities'); const [risk, setRisk] = useState('All Risk Levels'); const [query, setQuery] = useState(''); const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<'city' | 'clusterId' | 'accidentCount' | 'fatalRecords' | 'totalCasualties' | 'avgRiskScore'>('accidentCount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const pageSize = 5;
  const rows = useMemo(() => {
    const filtered = hotspots.filter((item) => (city === 'All Cities' || item.city === city) && (risk === 'All Risk Levels' || (item.avgRiskScore >= 0.7 ? 'High' : item.avgRiskScore >= 0.5 ? 'Medium' : 'Low') === risk) && `${item.city} ${item.clusterId}`.toLowerCase().includes(query.toLowerCase()));
    return [...filtered].sort((a, b) => {
      const left = a[sortKey]; const right = b[sortKey];
      const comparison = typeof left === 'string' && typeof right === 'string' ? left.localeCompare(right) : Number(left) - Number(right);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [hotspots, city, risk, query, sortKey, sortDirection]);
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize); const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const reset = () => { setCity('All Cities'); setRisk('All Risk Levels'); setQuery(''); setPage(1); };
  return <><PageHeader icon={List} title="Hotspot Records" subtitle="Detailed records of identified accident hotspots and their analytics" />{error && <StateMessage kind="error" message={error} />}{loading ? <StateMessage kind="loading" message="Loading records…" /> : <><div className="metric-grid"><MetricCard tone="red" icon={Car} label="Total Records" value="Unavailable" helper="Not exposed by API" /><MetricCard tone="purple" icon={Layers} label="Total Hotspots" value={totals.hotspots} helper="DBSCAN clusters" /><MetricCard tone="green" icon={MapPin} label="Cities Covered" value={totals.cities} helper="From hotspot rows" /><MetricCard tone="orange" icon={AlertTriangle} label="Noise Records" value="Unavailable" helper="Not exposed by API" /></div><div className="filter-bar records-filter"><label>City<select value={city} onChange={(event) => { setCity(event.target.value); setPage(1); }}><option>All Cities</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label><label>Risk level<select value={risk} onChange={(event) => { setRisk(event.target.value); setPage(1); }}><option>All Risk Levels</option><option>High</option><option>Medium</option><option>Low</option></select></label><label>Sort by<select value={sortKey} onChange={(event) => { setSortKey(event.target.value as typeof sortKey); setPage(1); }}><option value="accidentCount">Accident Count</option><option value="city">City</option><option value="clusterId">Cluster ID</option><option value="fatalRecords">Fatal Records</option><option value="totalCasualties">Casualties</option><option value="avgRiskScore">Average Risk</option></select></label><button className="secondary-button" onClick={() => { setSortDirection((value) => value === 'asc' ? 'desc' : 'asc'); setPage(1); }}>{sortDirection === 'asc' ? 'Ascending' : 'Descending'}</button><label className="search"><Search size={16} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search city or cluster..." /></label><button className="secondary-button" onClick={reset}><RotateCcw size={15} /> Reset</button></div><Panel title={`Hotspot Records (${rows.length} clusters)`} icon={<MapPin size={18} />}><div className="table-toolbar"><span className="muted">Client-side filters and sorting over the loaded API collection</span><button className="primary-button" onClick={() => exportHotspotsCsv(rows)}><Download size={15} /> Export CSV</button></div>{rows.length === 0 ? <StateMessage kind="empty" message="No hotspot records match the current filters." /> : <><HotspotTable rows={pageRows} /><div className="pagination"><span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, rows.length)} of {rows.length}</span><div><button disabled={page === 1} onClick={() => setPage((value) => value - 1)}>‹</button>{Array.from({ length: pages }, (_, index) => index + 1).slice(0, 7).map((value) => <button className={page === value ? 'active' : ''} key={value} onClick={() => setPage(value)}>{value}</button>)}<button disabled={page === pages} onClick={() => setPage((value) => value + 1)}>›</button></div></div></>}</Panel></>}</>;
}
