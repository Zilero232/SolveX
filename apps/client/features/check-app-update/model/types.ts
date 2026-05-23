export type UpdateStatus = 'idle' | 'available' | 'downloading' | 'installing' | 'error';

export type UpdateInfo = {
  status: UpdateStatus;
  currentVersion: string | null;
  version: string | null;
  date: string | null;
  progress: number;
  install: () => void;
  dismiss: () => void;
};
