import { BarChart3, Database, Home, Info, List, Map } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/hotspots', label: 'Hotspot Map', icon: Map },
  { to: '/records', label: 'Hotspot Records', icon: List },
  { to: '/city-analysis', label: 'City Analysis', icon: BarChart3 },
  { to: '/data-insights', label: 'Data Insights', icon: Database },
  { to: '/about', label: 'About Project', icon: Info },
];

interface Props { open: boolean; onToggle: () => void }

export function SideNavigation({ open, onToggle }: Props) {
  const location = useLocation();
  const closeOnMobile = () => {
    if (window.innerWidth <= 760) onToggle();
  };
  return (
    <aside className={`side-nav ${open ? 'open' : ''}`} aria-label="Application navigation">
        <div className="side-links">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={closeOnMobile} className={({ isActive }) => isActive || (to === '/dashboard' && location.pathname === '/') ? 'active' : ''} title={label}>
              <Icon size={21} /> <span>{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="safety-banner">
          <div className="road-art" />
          <div className="safety-copy"><span>✓</span><strong>Safer Roads<br />Safer India</strong></div>
        </div>
      </aside>
  );
}
