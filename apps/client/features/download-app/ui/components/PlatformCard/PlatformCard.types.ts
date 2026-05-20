import type { LucideIcon } from 'lucide-react';

import type { DesktopReleaseAsset } from '@/entities/desktop-release';

export type PlatformCardProps = {
  label: string;
  Icon: LucideIcon;
  asset?: DesktopReleaseAsset;
};
