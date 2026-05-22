'use client';

import { MessageSquare, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui';
import { chatHeaderStyles as s } from './ChatHeader.styles';
import type { ChatHeaderProps } from './ChatHeader.types';

export const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  const t = useTranslations('chat');

  return (
    <header className={s.root}>
      <div className={s.title}>
        <MessageSquare className={s.icon} />
        <span>{t('title')}</span>
      </div>
      <Button
        aria-label={t('close')}
        size="icon-sm"
        type="button"
        variant="ghost"
        onClick={onClose}
      >
        <X />
      </Button>
    </header>
  );
};
