'use client';

import { HeadphoneOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/cn';
import type { DeafenedBadgeProps } from './DeafenedBadge.types';

export const DeafenedBadge = ({ className }: DeafenedBadgeProps) => {
  const t = useTranslations('lobby.card');

  return (
    <span
      aria-label={t('deafened')}
      className={cn(
        'absolute -bottom-1 -left-1 z-10 flex size-3.5 items-center justify-center rounded-full bg-background ring-1 ring-background',
        className,
      )}
      role="img"
      title={t('deafened')}
    >
      <HeadphoneOff className="size-2.5 text-destructive" />
    </span>
  );
};
