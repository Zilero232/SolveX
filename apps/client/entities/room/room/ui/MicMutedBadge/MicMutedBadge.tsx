'use client';

import { MicOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/cn';
import type { MicMutedBadgeProps } from './MicMutedBadge.types';

export const MicMutedBadge = ({ className }: MicMutedBadgeProps) => {
  const t = useTranslations('lobby.card');

  return (
    <span
      aria-label={t('micMuted')}
      className={cn(
        'absolute -right-1 -bottom-1 z-10 flex size-3.5 items-center justify-center rounded-full bg-background ring-1 ring-background',
        className,
      )}
      role="img"
      title={t('micMuted')}
    >
      <MicOff className="size-2.5 text-destructive" />
    </span>
  );
};
