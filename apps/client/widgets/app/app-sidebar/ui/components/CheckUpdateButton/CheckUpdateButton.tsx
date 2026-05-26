'use client';

import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { appBus } from '@/shared/lib';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';

export const CheckUpdateButton = () => {
  const t = useTranslations('appSidebar');

  const handleClick = () => {
    appBus.push('recheckUpdate', undefined);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={t('checkUpdateLabel')}
          size="icon"
          variant="ghost"
          onClick={handleClick}
        >
          <RefreshCw />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{t('checkUpdate')}</TooltipContent>
    </Tooltip>
  );
};
