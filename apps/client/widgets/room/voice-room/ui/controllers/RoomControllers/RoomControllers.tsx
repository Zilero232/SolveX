'use client';

import { DeafenSyncController } from '../DeafenSyncController';
import { MicActivationController } from '../MicActivationController';
import { MicStateController } from '../MicStateController';
import { RoomDeviceController } from '../RoomDeviceController';
import { RoomSoundsController } from '../RoomSoundsController';
import { RoomTrayController } from '../RoomTrayController';
import { ShortcutActionsController } from '../ShortcutActionsController';

type RoomControllersProps = {
  roomId: string;
};

export const RoomControllers = ({ roomId }: RoomControllersProps) => (
  <>
    <RoomDeviceController />
    <RoomTrayController />
    <ShortcutActionsController />
    <MicActivationController />
    <MicStateController roomId={roomId} />
    <RoomSoundsController />
    <DeafenSyncController />
  </>
);
