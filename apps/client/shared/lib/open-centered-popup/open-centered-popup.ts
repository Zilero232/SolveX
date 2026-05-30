type PopupOptions = {
  width: number;
  height: number;
  name?: string;
};

export const openCenteredPopup = (url: string, { width, height, name }: PopupOptions): Window => {
  const screenLeft = window.screenLeft ?? window.screenX ?? 0;
  const screenTop = window.screenTop ?? window.screenY ?? 0;
  const viewportWidth = window.outerWidth ?? window.innerWidth;
  const viewportHeight = window.outerHeight ?? window.innerHeight;

  const left = Math.round(screenLeft + (viewportWidth - width) / 2);
  const top = Math.round(screenTop + (viewportHeight - height) / 2);

  const features = `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`;
  const popup = window.open(url, name, features);

  if (!popup || popup.closed) {
    throw new Error('Popup blocked — allow popups for this site');
  }

  return popup;
};
