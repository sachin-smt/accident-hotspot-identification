import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';
interface Item { name: string; value: number; color: string }
export function DonutChart({ items, center }: { items: Item[]; center: string }) {
  return <div className="donut-wrap"><div className="donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={items} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={2}>{items.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><strong>{center}</strong></div><div className="chart-legend">{items.map((item) => <div key={item.name}><i style={{ background: item.color }} />{item.name}<b>{item.value.toLocaleString()}</b></div>)}</div></div>;
}
