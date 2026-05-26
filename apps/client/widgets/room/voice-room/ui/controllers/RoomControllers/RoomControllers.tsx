'use client';

import { MicActivationController } from '../MicActivationController';
import { RoomDeviceController } from '../RoomDeviceController';
import { RoomSoundsController } from '../RoomSoundsController';
import { RoomTrayController } from '../RoomTrayController';
import { ShortcutActionsController } from '../ShortcutActionsController';

type RoomControllersProps = {
  isChatOpen: boolean;
};

// Aggregates every side-effect controller the voice room needs. Mounted once
// inside LiveKitRoom so each controller can pull from the participant/room
// context.
export const RoomControllers = ({ isChatOpen }: RoomControllersProps) => (
  <>
    <RoomDeviceController />
    <RoomTrayController />
    <ShortcutActionsController />
    <MicActivationController />
    <RoomSoundsController isChatOpen={isChatOpen} />
  </>
);
