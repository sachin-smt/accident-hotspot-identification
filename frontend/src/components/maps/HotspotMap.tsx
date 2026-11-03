import 'leaflet/dist/leaflet.css';
import '../../styles/map-markers.css';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { Hotspot } from '../../types/hotspot';
import { riskLevel } from '../../utils/risk';

interface Props { hotspots: Hotspot[]; selected?: Hotspot; onSelect: (hotspot: Hotspot) => void; height?: string }
function FitMap({ hotspots }: { hotspots: Hotspot[] }) {
  const map = useMap();
  useEffect(() => {
    if (hotspots.length > 0) map.setView([hotspots[0].latitude, hotspots[0].longitude], 5);
  }, [hotspots, map]);
  return null;
}
export function HotspotMap({ hotspots, onSelect, height = '470px' }: Props) {
  return <div className="map-frame" style={{ height }}><MapContainer center={[21.2, 78.9]} zoom={5} scrollWheelZoom className="leaflet-map"><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><FitMap hotspots={hotspots} />{hotspots.map((hotspot) => { const level = riskLevel(hotspot.avgRiskScore); return <CircleMarker key={`${hotspot.city}-${hotspot.clusterId}`} center={[hotspot.latitude, hotspot.longitude]} radius={Math.max(5, Math.min(18, 4 + Math.sqrt(hotspot.accidentCount) / 2))} pathOptions={{ className: `hotspot-marker hotspot-marker-${level.toLowerCase()}`, color: '#111827', fillColor: level === 'High' ? '#DC2626' : level === 'Medium' ? '#F97316' : '#FACC15', fillOpacity: 0.86, opacity: 1, weight: 2 }} eventHandlers={{ click: () => onSelect(hotspot) }}><Popup><strong>{hotspot.city}</strong><br />Cluster {hotspot.clusterId}<br />{hotspot.accidentCount.toLocaleString()} clustered accidents</Popup></CircleMarker>; })}</MapContainer><div className="map-legend"><span><i className="high" />High</span><span><i className="medium" />Medium</span><span><i className="low" />Low</span></div></div>;
}
