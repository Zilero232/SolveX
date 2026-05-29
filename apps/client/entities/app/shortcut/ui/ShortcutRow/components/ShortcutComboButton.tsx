'use client';

import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui';
import { shortcutRowStyles as s, shortcutButton } from '../ShortcutRow.styles';

type ShortcutComboButtonProps = {
  display: string;
  label: string;
  recording: boolean;
  showConflictHint: boolean;
  onClick: () => void;
};

export const ShortcutComboButton = ({
  display,
  label,
  recording,
  showConflictHint,
  onClick,
}: ShortcutComboButtonProps) => {
  const t = useTranslations('settings.shortcuts');

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip open={showConflictHint ? undefined : false}>
        <TooltipTrigger asChild>
          <Button
            aria-label={recording ? t('recording') : label}
            className={shortcutButton({ conflict: showConflictHint })}
            type="button"
            variant="outline"
            onClick={onClick}
          >
            {showConflictHint && <TriangleAlert aria-hidden className={s.warnIcon} />}
            <span>{display}</span>
          </Button>
        </TooltipTrigger>

        {showConflictHint && (
          <TooltipContent className={s.tooltip} side="top" sideOffset={6}>
            {t('errors.systemTaken')}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
