import type { LucideIcon } from 'lucide-react';

interface Props { icon: LucideIcon; title: string; subtitle: string }
export function PageHeader({ icon: Icon, title, subtitle }: Props) {
  return <div className="page-header"><Icon size={42} /><div><h1>{title}</h1><p>{subtitle}</p></div></div>;
}
