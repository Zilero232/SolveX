import type { ClipboardEvent } from 'react';

export type ChatComposerProps = {
  isSending: boolean;
  isUploading: boolean;
  onSend: (value: string) => Promise<void>;
  onAttach: () => void;
  onPaste: (event: ClipboardEvent) => void;
};
