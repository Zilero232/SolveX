'use client';

import { BadgeCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/cn';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';
import { checkSizes, userNameStyles as s } from './UserName.styles';
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

  return (
    <span className={s.root}>
      {profileUrl ? (
        <a
          href={profileUrl}
          rel="noreferrer noopener"
          target="_blank"
          className={cn(s.link, className)}
          onClick={(event) => event.stopPropagation()}
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
