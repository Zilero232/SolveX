'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DownloadAppDialog } from '@/features/app/download-app';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';

export const DownloadAppButton = () => {
  const t = useTranslations('appSidebar');
  const [isOpen, toggle] = useBoolean(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={t('downloadAppLabel')}
            size="icon"
            variant="ghost"
            onClick={() => toggle(true)}
          >
            <Download />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">{t('downloadApp')}</TooltipContent>
      </Tooltip>

      <DownloadAppDialog open={isOpen} onOpenChange={toggle} />
    </>
  );
};
