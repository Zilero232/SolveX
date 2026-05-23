'use client';

import { useCheckAppUpdate } from '../model/use-check-app-update';
import { UpdateDialog } from './UpdateDialog';

export const AppUpdater = () => {
  const { install, dismiss, ...info } = useCheckAppUpdate();

  return <UpdateDialog {...info} onInstall={install} onDismiss={dismiss} />;
};
