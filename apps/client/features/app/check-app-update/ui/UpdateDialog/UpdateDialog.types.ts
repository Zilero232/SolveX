import type { UpdateInfo } from '../../model/types';

export type UpdateDialogProps = Omit<UpdateInfo, 'install' | 'dismiss'> & {
  onInstall: () => void;
  onDismiss: () => void;
};
