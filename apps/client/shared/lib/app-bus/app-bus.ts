import { createEventEmitter } from '@siberiacancode/reactuse';

type AppBusEvents = {
  recheckUpdate: undefined;
  trayMuteToggle: undefined;
  muteToggle: undefined;
  pttKey: { phase: 'pressed' | 'released' };
  pttHold: { phase: 'pressed' | 'released' };
};

export const appBus = createEventEmitter<AppBusEvents>();
