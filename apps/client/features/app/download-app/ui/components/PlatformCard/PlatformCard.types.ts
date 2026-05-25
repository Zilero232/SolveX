import type { LucideIcon } from 'lucide-react';
import type { ReleaseAsset } from '@/entities/app/release';

export type PlatformCardProps = {
  label: string;
  Icon: LucideIcon;
  asset?: ReleaseAsset;
};
