'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNavHistory } from '../../model/hooks/use-nav-history';
import { useWindowControls } from '../../model/hooks/use-window-controls';
import { useWindowPlatform } from '../../model/hooks/use-window-platform';
import { TitleBarControls } from './components';
import { titleBarStyles as s } from './TitleBar.styles';

export const TitleBar = () => {
  const platform = useWindowPlatform();
  const router = useRouter();
  const { canGoBack, canGoForward } = useNavHistory();
  const { isMaximized, minimize, toggleMaximize, close } = useWindowControls();

  if (!platform) return null;

  const showControls = platform !== 'macos';

  return (
    <div className={s.root({ platform: platform === 'macos' ? 'macos' : 'windows' })}>
      <div className={s.navButtons}>
        <button
          type="button"
          className={s.navButton}
          disabled={!canGoBack}
          onClick={() => router.back()}
        >
          <ChevronLeft className={s.navIcon} />
        </button>
        <button
          type="button"
          className={s.navButton}
          disabled={!canGoForward}
          onClick={() => router.forward()}
        >
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
