'use client';

import { useDeviceSync } from '../../../model';

// Runs inside LiveKitRoom so it can bind the persisted device selection to the
// live room — applying saved devices and mirroring runtime switches back.
export const RoomDeviceController = () => {
  useDeviceSync();

  return null;
};
