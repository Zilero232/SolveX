'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { SmilePlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui';
import { useReactions } from '../../../../model/contexts/reactions-context';
import { controlButton } from '../ControlButton/ControlButton.styles';
import { EmojiPicker } from './EmojiPicker';
import { reactionButtonStyles as s } from './ReactionButton.styles';

export const ReactionButton = () => {
  const t = useTranslations('room.controls');

  const [isOpen, toggleOpen] = useBoolean(false);

  const { send } = useReactions();

  const pick = (emoji: string) => {
    send(emoji);
    toggleOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={toggleOpen}>
      <PopoverTrigger aria-label={t('react')} className={controlButton({ tone: 'off' })}>
        <SmilePlus />
      </PopoverTrigger>

      <PopoverContent align="center" className={s.popover} side="top">
        <EmojiPicker onPick={pick} />
      </PopoverContent>
    </Popover>
  );
};
