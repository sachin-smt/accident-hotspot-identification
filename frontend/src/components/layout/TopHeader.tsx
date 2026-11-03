import { Activity, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface Props { open: boolean; onToggle: () => void }

export function TopHeader({ open, onToggle }: Props) {
  return (
    <header className="top-header">
      <button className="sidebar-toggle" onClick={onToggle} aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'} aria-expanded={open}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <NavLink className="brand-lockup" to="/">
        <span className="brand-mark"><Activity size={27} /></span>
        <span><strong>Accident <em>Hotspot</em></strong><small>AI-Based Accident Hotspot Identification</small></span>
      </NavLink>
    </header>
  );
}
