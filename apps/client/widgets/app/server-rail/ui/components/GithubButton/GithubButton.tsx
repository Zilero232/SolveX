'use client';

import { useTranslations } from 'next-intl';
import { EXTERNAL_LINKS } from '@/shared/constants';
import { Button, GithubIcon, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';

export const GithubButton = () => {
  const t = useTranslations('serverRail');

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button aria-label={t('githubLabel')} asChild size="icon" variant="ghost">
          <a href={EXTERNAL_LINKS.repository} rel="noopener noreferrer" target="_blank">
            <GithubIcon />
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{t('github')}</TooltipContent>
    </Tooltip>
  );
};
