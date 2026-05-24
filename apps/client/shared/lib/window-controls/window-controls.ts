import { getCurrentWindow } from '@tauri-apps/api/window';

// Wraps a window operation in a uniform try/catch so consumers can call these
// without their own error handling. Failures are logged and swallowed — window
// ops are best-effort UI side effects, never load-bearing.
const safeWindow = async (label: string, fn: () => Promise<void>) => {
  try {
    await fn();
  } catch (err) {
    console.error(`Window ${label} failed`, err);
  }
};

// Reveal the main window: unminimize first so a minimized window comes back
// from the taskbar, then show in case it was hidden to the tray, then focus.
export const showMainWindow = async () => {
  await safeWindow('show', async () => {
    const win = getCurrentWindow();

    await win.unminimize();
    await win.show();
    await win.setFocus();
  });
};

export const hideMainWindow = async () => {
  await safeWindow('hide', async () => {
    await getCurrentWindow().hide();
  });
};

export const toggleMainWindow = async () => {
  await safeWindow('toggle', async () => {
    const win = getCurrentWindow();

    if (await win.isVisible()) {
      await win.hide();
      return;
    }

    await showMainWindow();
  });
};

export const minimizeMainWindow = async () => {
  await safeWindow('minimize', async () => {
    await getCurrentWindow().minimize();
  });
};

export const toggleMaximizeMainWindow = async () => {
  await safeWindow('toggleMaximize', async () => {
    await getCurrentWindow().toggleMaximize();
  });
};

export const closeMainWindow = async () => {
  await safeWindow('close', async () => {
    await getCurrentWindow().close();
  });
};

export const isMainWindowMaximized = async () => {
  try {
    return await getCurrentWindow().isMaximized();
  } catch (err) {
    console.error('Window isMaximized failed', err);
    return false;
  }
};

export const onMainWindowResized = async (handler: () => void) => {
  try {
    return await getCurrentWindow().onResized(handler);
  } catch (err) {
    console.error('Window onResized failed', err);
    return () => {};
  }
};
