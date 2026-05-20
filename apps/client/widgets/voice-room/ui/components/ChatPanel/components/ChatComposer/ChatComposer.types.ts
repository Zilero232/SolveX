export interface ChatComposerProps {
  isSending: boolean;
  onSend: (value: string) => Promise<void>;
}
