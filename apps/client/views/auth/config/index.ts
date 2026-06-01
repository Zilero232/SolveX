import { AudioWaveform, MonitorSmartphone, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type AuthFeature = {
  key: 'rooms' | 'quality' | 'everywhere';
  Icon: LucideIcon;
};

export const AUTH_FEATURES: AuthFeature[] = [
  { key: 'rooms', Icon: Zap },
  { key: 'quality', Icon: AudioWaveform },
  { key: 'everywhere', Icon: MonitorSmartphone },
];

export type AuthEqBar = {
  id: string;
  height: string;
  delay: string;
};

export const AUTH_EQ_BARS: AuthEqBar[] = [
  { id: 'a', height: '40%', delay: '0ms' },
  { id: 'b', height: '85%', delay: '120ms' },
  { id: 'c', height: '60%', delay: '240ms' },
  { id: 'd', height: '100%', delay: '90ms' },
  { id: 'e', height: '55%', delay: '320ms' },
  { id: 'f', height: '75%', delay: '180ms' },
];
