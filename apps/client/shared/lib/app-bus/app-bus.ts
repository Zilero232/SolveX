import { createEventEmitter } from '@siberiacancode/reactuse';

type AppBusEvents = {
  recheckUpdate: undefined;
  trayMuteToggle: undefined;
  muteToggle: undefined;
  deafenToggle: undefined;
  micActivated: undefined;
  pttKey: { phase: 'pressed' | 'released' };
  pttHold: { phase: 'pressed' | 'released' };
};

export const appBus = createEventEmitter<AppBusEvents>();
