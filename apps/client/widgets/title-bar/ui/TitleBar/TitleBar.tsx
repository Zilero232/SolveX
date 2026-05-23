'use client';

import { useWindowControls } from '../../model/use-window-controls';
import { useWindowPlatform } from '../../model/use-window-platform';
import { TitleBarControls } from './components';
import { titleBarStyles as s } from './TitleBar.styles';

export const TitleBar = () => {
  const platform = useWindowPlatform();
  const { isMaximized, minimize, toggleMaximize, close } = useWindowControls();

  if (!platform) return null;

  const showControls = platform !== 'macos';

  return (
    <div className={s.root({ platform: platform === 'macos' ? 'macos' : 'windows' })}>
      <div className={s.dragRegion} data-tauri-drag-region />

      {showControls && (
        <TitleBarControls
          isMaximized={isMaximized}
          onClose={close}
          onMinimize={minimize}
          onToggleMaximize={toggleMaximize}
        />
      )}
    </div>
  );
};
