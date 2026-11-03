export interface Hotspot {
  id: number;
  city: string;
  clusterId: number;
  accidentCount: number;
  latitude: number;
  longitude: number;
  fatalRecords: number;
  totalCasualties: number;
  avgRiskScore: number;
}

export type RiskLevel = 'High' | 'Medium' | 'Low';
