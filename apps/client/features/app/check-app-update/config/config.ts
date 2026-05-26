export const APP_UPDATE_CONFIG = {
  // Stop blocking the splash if the updater endpoint hasn't answered in this
  // many ms — let the user into the app instead of leaving them staring at
  // "Checking for updates…" on a flaky network.
  checkTimeoutMs: 5000,
} as const;
