export type ChatComposerProps = {
  isSending: boolean;
  onSend: (value: string) => Promise<void>;
};
