'use client';

import { encodeChatAttachment } from '@chatovo/schemas';
import { useDropZone, useFileDialog } from '@siberiacancode/reactuse';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { uploadChatAttachment } from '@/shared/api';
import type { ClipboardEvent } from 'react';

const ATTACHMENT_MAX_BYTES = 25 * 1024 * 1024;

type UseChatFilesParams = {
  roomId: string;
  disabled: boolean;
  onSend: (value: string) => Promise<unknown>;
};

export const useChatFiles = ({ roomId, disabled, onSend }: UseChatFilesParams) => {
  const t = useTranslations('chat');

  const { isPending, mutate } = useMutation({
    mutationFn: async (files: File[]) => {
      for (const file of files) {
        const attachment = await uploadChatAttachment(roomId, file);

        await onSend(encodeChatAttachment(attachment));
      }
    },
    onError: () => {
      toast.error(t('uploadFailed'));
    },
  });

  const sendFiles = (files: File[]) => {
    if (disabled || isPending || files.length === 0) return;

    const tooLarge = files.find((file) => file.size > ATTACHMENT_MAX_BYTES);

    if (tooLarge) {
      toast.error(t('fileTooLarge'));

      return;
    }

    mutate(files);
  };

  const { open } = useFileDialog((value) => {
    if (value) sendFiles(Array.from(value));
  });

  const { ref, overed } = useDropZone<HTMLElement>((files) => {
    if (files) sendFiles(files);
  });

  const onPaste = (event: ClipboardEvent) => {
    const files = Array.from(event.clipboardData.files);

    if (files.length === 0) return;

    event.preventDefault();
    sendFiles(files);
  };

  return {
    isUploading: isPending,
    dropRef: ref,
    overed,
    onPaste,
    openPicker: open,
  };
};
