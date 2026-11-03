import type { LucideIcon } from 'lucide-react';
interface Props { label: string; value: string | number; helper: string; icon: LucideIcon; tone: 'red' | 'purple' | 'green' | 'orange' }
export function MetricCard({ label, value, helper, icon: Icon, tone }: Props) {
  return <div className={`metric-card ${tone}`}><div className="metric-icon"><Icon size={25} /></div><div><span>{label}</span><strong>{value}</strong><small>{helper}</small></div></div>;
}
