import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AboutProject } from './pages/AboutProject/AboutProject';
import { CityAnalysis } from './pages/CityAnalysis/CityAnalysis';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { DataInsights } from './pages/DataInsights/DataInsights';
import { HotspotMapPage } from './pages/HotspotMap/HotspotMap';
import { HotspotRecords } from './pages/HotspotRecords/HotspotRecords';

export function App() {
  return <Routes><Route element={<AppShell />}><Route path="/" element={<Dashboard />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/hotspots" element={<HotspotMapPage />} /><Route path="/records" element={<HotspotRecords />} /><Route path="/city-analysis" element={<CityAnalysis />} /><Route path="/data-insights" element={<DataInsights />} /><Route path="/about" element={<AboutProject />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes>;
}
