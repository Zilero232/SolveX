export const POPUP_TIMEOUT_MS = 120_000;

export const POPUP_POLL_MS = 500;

export const POPUP_FEATURES = 'width=480,height=640,menubar=no,toolbar=no,location=no,status=no';

export const DEEP_LINK_SCHEME = 'chatovo';

export const DEEP_LINK_CALLBACK = `${DEEP_LINK_SCHEME}://auth/callback`;

// Tauri can't detect when the user closes the browser tab, so we time out the
// loading state after a minute rather than blocking the UI for two.
export const DEEP_LINK_TIMEOUT_MS = 60_000;
