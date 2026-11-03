import { getJson } from './apiClient';
import type { HealthResponse } from '../types/api';
import type { Hotspot } from '../types/hotspot';

export const fetchHotspots = (signal?: AbortSignal) =>
  getJson<Hotspot[]>('/hotspots', signal);

export const fetchHealth = (signal?: AbortSignal) =>
  getJson<HealthResponse>('/health', signal);
