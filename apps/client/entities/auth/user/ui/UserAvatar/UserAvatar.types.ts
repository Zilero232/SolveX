import type { ComponentProps } from 'react';
import type { Avatar } from '@/shared/ui';

export type UserAvatarProps = {
  name: string;
  src?: string | null;
  size?: ComponentProps<typeof Avatar>['size'];
  colorize?: boolean;
  className?: string;
  fallbackClassName?: string;
};
