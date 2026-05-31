'use client';

import { useKeyboard, useTextareaAutosize } from '@siberiacancode/reactuse';
import { Paperclip, SendHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button, Spinner } from '@/shared/ui';
import { chatComposerStyles as s } from './ChatComposer.styles';
import type { ChatComposerProps } from './ChatComposer.types';

export const ChatComposer = ({
  isSending,
  isUploading,
  onSend,
  onAttach,
  onPaste,
}: ChatComposerProps) => {
  const t = useTranslations('chat');
  const { ref, value: draft, set, clear } = useTextareaAutosize<HTMLTextAreaElement>('');

  const busy = isSending || isUploading;

  const submit = async () => {
    const value = draft.trim();

    if (!value || busy) return;

    clear();

    try {
      await onSend(value);
    } catch {
      set(value);
    } finally {
      ref.current?.focus();
    }
  };

  useKeyboard(ref, (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return;

    event.preventDefault();
    void submit();
  });

  const canSend = draft.trim().length > 0 && !busy;

  return (
    <form
      className={s.root}
      onSubmit={(event) => {
        event.preventDefault();

        void submit();
      }}
    >
      <Button
        aria-label={t('attach')}
        disabled={busy}
        size="icon-sm"
        type="button"
        variant="ghost"
        onClick={onAttach}
      >
        {isUploading ? <Spinner /> : <Paperclip />}
      </Button>

      <textarea
        ref={ref}
        className={s.input}
        disabled={isSending}
        placeholder={isUploading ? t('uploading') : t('messagePlaceholder')}
        rows={1}
        value={draft}
        onChange={(event) => set(event.target.value)}
        onPaste={onPaste}
      />

      <Button aria-label={t('send')} disabled={!canSend} size="icon-sm" type="submit">
        <SendHorizontal />
      </Button>
    </form>
  );
};
