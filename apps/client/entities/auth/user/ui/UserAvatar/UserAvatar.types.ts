import type { ComponentProps } from 'react';
import type { Avatar } from '@/shared/ui';

export type UserAvatarProps = {
  name: string;
  src?: string | null;
  size?: ComponentProps<typeof Avatar>['size'];
  // Tints the fallback background by hashing `name`; off by default so callers
  // that don't want the rainbow palette (e.g. plain primary chip) get clean look.
  colorize?: boolean;
  className?: string;
  fallbackClassName?: string;
};
