'use client';

import { isTauri } from '@tauri-apps/api/core';
import { openUrl } from '@tauri-apps/plugin-opener';
import { BadgeCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/cn';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';
import { checkSizes, userNameStyles as s } from './UserName.styles';
import type { MouseEvent } from 'react';
import type { UserNameProps } from './UserName.types';

export const UserName = ({
  name,
  verified = false,
  profileUrl = null,
  size = 'sm',
  className,
}: UserNameProps) => {
  const t = useTranslations('user');

  const check = verified ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span aria-label={t('verified')} className={s.checkWrap} role="img">
          <BadgeCheck className={cn(s.check, checkSizes[size])} />
        </span>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{t('verified')}</TooltipContent>
    </Tooltip>
  ) : null;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();

    if (!profileUrl || !isTauri()) return;

    event.preventDefault();

    openUrl(profileUrl);
  };

  return (
    <span className={s.root}>
      {profileUrl ? (
        <a
          href={profileUrl}
          rel="noreferrer noopener"
          target="_blank"
          className={cn(s.link, className)}
          onClick={handleClick}
        >
          {name}
        </a>
      ) : (
        <span className={cn(s.text, className)}>{name}</span>
      )}
      {check}
    </span>
  );
};
