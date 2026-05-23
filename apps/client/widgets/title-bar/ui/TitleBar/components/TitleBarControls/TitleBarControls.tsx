'use client';

import { Copy, Minus, Square, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { titleBarControlsStyles as s } from './TitleBarControls.styles';
import type { TitleBarControlsProps } from './TitleBarControls.types';

export const TitleBarControls = ({
  isMaximized,
  onMinimize,
  onToggleMaximize,
  onClose,
}: TitleBarControlsProps) => {
  const t = useTranslations('window');

  return (
    <div className={s.root}>
      <button aria-label={t('minimize')} className={s.button} type="button" onClick={onMinimize}>
        <Minus className={s.icon} strokeWidth={1.5} />
      </button>

      <button
        aria-label={isMaximized ? t('restore') : t('maximize')}
        className={s.button}
        type="button"
        onClick={onToggleMaximize}
      >
        {isMaximized ? (
          <Copy className={s.icon} strokeWidth={1.5} />
        ) : (
          <Square className={s.icon} strokeWidth={1.5} />
        )}
      </button>

      <button aria-label={t('close')} className={s.closeButton} type="button" onClick={onClose}>
        <X className={s.icon} strokeWidth={1.5} />
      </button>
    </div>
  );
};
