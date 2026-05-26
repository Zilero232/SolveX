import { createEventEmitter } from '@siberiacancode/reactuse';

// Typed in-app event bus. Use for cross-slice signals where producer and
// consumer are decoupled (tray menu → updater hook, etc.). Prefer this over
// `window.dispatchEvent` — no string event names at the call site, no global
// listener leaks, and `useSubscribe` handles React cleanup.

type AppBusEvents = {
  recheckUpdate: undefined;
  trayMuteToggle: undefined;
  muteToggle: undefined;
  // Low-level: raw shortcut key edge from the OS-side global-shortcut bridge.
  // Subscribers shouldn't act on this unless they're orchestrating PTT (see
  // useShortcutActions). UI/sound subscribers listen to `pttHold` instead.
  pttKey: { phase: 'pressed' | 'released' };
  // High-level: PTT transmission edge after policy checks (mute gate, mode).
  // This is the signal UI and sound subscribers should follow.
  pttHold: { phase: 'pressed' | 'released' };
};

export const appBus = createEventEmitter<AppBusEvents>();
