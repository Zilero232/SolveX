export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'unavailable'
  | 'available'
  | 'downloading'
  | 'installing'
  | 'error';

export type UpdateInfo = {
  status: UpdateStatus;
  currentVersion: string | null;
  version: string | null;
  date: string | null;
  progress: number;
  silent: boolean;
  install: () => void;
  dismiss: () => void;
};
