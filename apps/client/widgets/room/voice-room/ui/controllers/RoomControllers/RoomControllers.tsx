'use client';

import { MicActivationController } from '../MicActivationController';
import { MicStateController } from '../MicStateController';
import { RoomDeviceController } from '../RoomDeviceController';
import { RoomSoundsController } from '../RoomSoundsController';
import { RoomTrayController } from '../RoomTrayController';
import { ShortcutActionsController } from '../ShortcutActionsController';

type RoomControllersProps = {
  roomId: string;
  isChatOpen: boolean;
};

export const RoomControllers = ({ roomId, isChatOpen }: RoomControllersProps) => (
  <>
    <RoomDeviceController />
    <RoomTrayController />
    <ShortcutActionsController />
    <MicActivationController />
    <MicStateController roomId={roomId} />
    <RoomSoundsController isChatOpen={isChatOpen} />
  </>
);
