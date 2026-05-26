import { createEventEmitter } from '@siberiacancode/reactuse';

// Typed in-app event bus. Use for cross-slice signals where producer and
// consumer are decoupled (tray menu → updater hook, etc.). Prefer this over
// `window.dispatchEvent` — no string event names at the call site, no global
// listener leaks, and `useSubscribe` handles React cleanup.

type AppBusEvents = {
  recheckUpdate: undefined;
  trayMuteToggle: undefined;
  muteToggle: undefined;
  pttKey: { phase: 'pressed' | 'released' };
  pttHold: { phase: 'pressed' | 'released' };
};

export const appBus = createEventEmitter<AppBusEvents>();
