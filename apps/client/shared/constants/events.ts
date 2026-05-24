// Tauri-side events: emitted/listened via getCurrentWindow().emit/listen,
// routed through Rust IPC. Used for native UI (tray menu, OS window) talking
// to the JS app.
export const TAURI_EVENTS = {
  trayMuteToggle: 'tray://mute-toggle',
} as const;

// DOM-side events: dispatched on globalThis with CustomEvent, listened with
// addEventListener. Used for in-app cross-feature signals that don't need to
// cross the JS/Rust boundary.
export const APP_EVENTS = {
  recheckUpdate: 'chatovo:recheck-update',
} as const;
