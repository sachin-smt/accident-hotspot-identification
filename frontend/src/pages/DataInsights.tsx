import { BarChart3, Database, Layers, MapPin } from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { Unavailable } from '../components/common/Unavailable';
import { useHotspots } from '../hooks/useHotspots';

export function DataInsights() {
  const { totals } = useHotspots();
  return <><PageHeader icon={Database} title="Data Insights" subtitle="In-depth analysis of accident data, trends, patterns, and key factors" /><div className="metric-grid"><MetricCard tone="red" icon={BarChart3} label="Total Accident Records" value="Unavailable" helper="Not exposed by API" /><MetricCard tone="purple" icon={Layers} label="Total Hotspots" value={totals.hotspots || '—'} helper="DBSCAN clusters" /><MetricCard tone="green" icon={MapPin} label="Cities Covered" value={totals.cities || '—'} helper="From hotspot rows" /><MetricCard tone="orange" icon={Database} label="Overall Risk Score" value={totals.hotspots ? totals.averageRisk.toFixed(3) : 'Unavailable'} helper="Hotspot weighted average" /></div><div className="filter-bar"><label>Date Range<select><option>Unavailable — no date API</option></select></label><label>Road Type<select><option>Unavailable — no accident API</option></select></label><label>Weather<select><option>Unavailable — no accident API</option></select></label></div><div className="insights-grid"><Panel title="Accident Trend (Monthly)" icon={<BarChart3 size={18} />}><Unavailable /></Panel><Panel title="Accidents by Road Type" icon={<Database size={18} />}><Unavailable /></Panel><Panel title="Accidents by Weather" icon={<Database size={18} />}><Unavailable /></Panel><Panel title="Accidents by Hour of Day" icon={<BarChart3 size={18} />}><Unavailable /></Panel><Panel title="Top Contributing Factors" icon={<MapPin size={18} />}><Unavailable /></Panel><Panel title="Key Insights" icon={<BarChart3 size={18} />}><Unavailable title="Insight generation unavailable" /></Panel></div></>;
}
