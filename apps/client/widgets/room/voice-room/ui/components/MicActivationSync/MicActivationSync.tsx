'use client';

import { useMicActivationMode } from '../../../model/hooks/use-mic-activation-mode';

export const MicActivationSync = () => {
  useMicActivationMode();
  return null;
};
