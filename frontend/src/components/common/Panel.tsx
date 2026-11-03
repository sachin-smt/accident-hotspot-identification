import type { ReactNode } from 'react';
interface Props { title?: string; icon?: ReactNode; children: ReactNode; className?: string }
export function Panel({ title, icon, children, className = '' }: Props) {
  return <section className={`panel ${className}`}>{title && <div className="panel-title">{icon}{title}</div>}{children}</section>;
}
