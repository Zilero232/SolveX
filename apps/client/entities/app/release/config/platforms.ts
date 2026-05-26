import { Apple, AppWindow, type LucideIcon, Terminal } from 'lucide-react';
import type { DesktopPlatform } from '../model/types';

export type DesktopPlatformConfig = {
  Icon: LucideIcon;
  id: DesktopPlatform;
  label: string;
};

export const DESKTOP_PLATFORMS: DesktopPlatformConfig[] = [
  { id: 'macos', label: 'macOS', Icon: Apple },
  { id: 'windows', label: 'Windows', Icon: AppWindow },
  { id: 'linux', label: 'Linux', Icon: Terminal },
];

export const EXTENSION_TO_PLATFORM: Record<string, DesktopPlatform> = {
  msi: 'windows',
  exe: 'windows',
  dmg: 'macos',
  app: 'macos',
  deb: 'linux',
  appimage: 'linux',
  rpm: 'linux',
};
