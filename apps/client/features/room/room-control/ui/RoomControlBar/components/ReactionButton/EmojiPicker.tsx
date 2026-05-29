'use client';

import { EmojiPicker as Picker } from 'frimousse';
import { useTranslations } from 'next-intl';
import { emojiPickerStyles as s } from './EmojiPicker.styles';
import type { EmojiPickerListEmojiProps } from 'frimousse';

type EmojiPickerProps = {
  onPick: (emoji: string) => void;
};

const EmojiButton = ({ emoji, ...props }: EmojiPickerListEmojiProps) => {
  return (
    <button {...props} className={s.emoji} data-active={emoji.isActive} type="button">
      {emoji.emoji}
    </button>
  );
};

export const EmojiPicker = ({ onPick }: EmojiPickerProps) => {
  const t = useTranslations('room.controls');

  return (
    <Picker.Root className={s.root} onEmojiSelect={({ emoji }) => onPick(emoji)}>
      <Picker.Search className={s.search} placeholder={t('emojiSearch')} />

      <Picker.Viewport className={s.viewport}>
        <Picker.Loading className={s.state}>{t('emojiLoading')}</Picker.Loading>
        <Picker.Empty className={s.state}>{t('emojiEmpty')}</Picker.Empty>

        <Picker.List
          className={s.list}
          components={{
            CategoryHeader: ({ category, ...props }) => (
              <div {...props} className={s.categoryHeader}>
                {category.label}
              </div>
            ),
            Row: ({ children, ...props }) => (
              <div {...props} className={s.row}>
                {children}
              </div>
            ),
            Emoji: EmojiButton,
          }}
        />
      </Picker.Viewport>
    </Picker.Root>
  );
};
