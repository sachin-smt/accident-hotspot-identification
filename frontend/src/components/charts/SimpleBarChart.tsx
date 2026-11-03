interface Item { label: string; value: number }
export function SimpleBarChart({ items, color = '#a668ff' }: { items: Item[]; color?: string }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return <div className="bars">{items.map((item) => <div className="bar-item" key={item.label}><div className="bar-value">{item.value.toLocaleString()}</div><div className="bar-track"><i style={{ height: `${Math.max(5, item.value / max * 100)}%`, background: color }} /></div><span>{item.label}</span></div>)}</div>;
}
