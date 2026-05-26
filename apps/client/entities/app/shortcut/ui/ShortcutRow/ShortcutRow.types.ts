export type ShortcutRowProps = {
  label: string;
  display: string;
  recording: boolean;
  showConflictHint: boolean;
  clearVisible: boolean;
  onRecord: () => void;
  onClear: () => void;
};
