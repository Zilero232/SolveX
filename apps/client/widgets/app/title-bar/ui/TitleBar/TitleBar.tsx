'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavHistory } from '@/shared/hooks';
import { useWindowControls, useWindowPlatform } from '../../model/hooks';
import { TitleBarControls } from './components';
import { titleBarStyles as s } from './TitleBar.styles';

export const TitleBar = () => {
  const platform = useWindowPlatform();
  const { canGoBack, canGoForward, goBack, goForward } = useNavHistory();
  const { isMaximized, minimize, toggleMaximize, close } = useWindowControls();

  if (!platform) return null;

  const showControls = platform !== 'macos';

  return (
    <div className={s.root({ platform: platform === 'macos' ? 'macos' : 'windows' })}>
      <div className={s.navButtons}>
        <button type="button" className={s.navButton} disabled={!canGoBack} onClick={goBack}>
          <ChevronLeft className={s.navIcon} />
        </button>
        <button type="button" className={s.navButton} disabled={!canGoForward} onClick={goForward}>
          <ChevronRight className={s.navIcon} />
        </button>
      </div>

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
