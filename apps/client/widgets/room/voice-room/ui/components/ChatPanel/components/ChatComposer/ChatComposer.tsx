'use client';

import { useTextareaAutosize } from '@siberiacancode/reactuse';
import { SendHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui';
import { chatComposerStyles as s } from './ChatComposer.styles';
import type { KeyboardEvent } from 'react';
import type { ChatComposerProps } from './ChatComposer.types';

export const ChatComposer = ({ isSending, onSend }: ChatComposerProps) => {
  const t = useTranslations('chat');
  const { ref, value: draft, set, clear } = useTextareaAutosize<HTMLTextAreaElement>('');

  const submit = async () => {
    const value = draft.trim();
    if (!value || isSending) return;
    clear();
    try {
      await onSend(value);
    } catch {
      set(value);
    } finally {
      ref.current?.focus();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    void submit();
  };

  const canSend = draft.trim().length > 0 && !isSending;

  return (
    <form
      className={s.root}
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <textarea
        ref={ref}
        className={s.input}
        disabled={isSending}
        placeholder={t('messagePlaceholder')}
        rows={1}
        value={draft}
        onChange={(event) => set(event.target.value)}
        onKeyDown={onKeyDown}
      />
      <Button aria-label={t('send')} disabled={!canSend} size="icon-sm" type="submit">
        <SendHorizontal />
      </Button>
    </form>
  );
};
