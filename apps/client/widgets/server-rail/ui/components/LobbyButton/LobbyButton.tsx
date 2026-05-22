'use client';

import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/shared/constants';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';

export const LobbyButton = () => {
  const t = useTranslations('serverRail');
  const router = useRouter();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={t('lobby')}
          size="icon"
          variant="ghost"
          onClick={() => router.replace(ROUTES.lobby)}
        >
          <Home />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{t('lobby')}</TooltipContent>
    </Tooltip>
  );
};
