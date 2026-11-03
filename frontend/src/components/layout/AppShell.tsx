import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SideNavigation } from './SideNavigation';
import { TopHeader } from './TopHeader';

export function AppShell() {
  const [navOpen, setNavOpen] = useState(false);
  const toggleNavigation = () => setNavOpen((open) => !open);
  return (
    <div className={`app-shell ${navOpen ? 'navigation-expanded' : 'navigation-collapsed'}`}>
      <TopHeader open={navOpen} onToggle={toggleNavigation} />
      <SideNavigation open={navOpen} onToggle={toggleNavigation} />
      {navOpen && <button className="navigation-overlay" aria-label="Close navigation" onClick={toggleNavigation} />}
      <main className="main-content"><Outlet /></main>
    </div>
  );
}
