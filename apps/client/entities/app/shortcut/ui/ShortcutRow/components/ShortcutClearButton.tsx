'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui';

type ShortcutClearButtonProps = {
  visible: boolean;
  onClick: () => void;
};

// Stays mounted but invisible when there is no binding to clear, so the row
// width does not jump when the user assigns or removes a combo.
export const ShortcutClearButton = ({ visible, onClick }: ShortcutClearButtonProps) => {
  const t = useTranslations('settings.shortcuts');

  return (
    <Button
      aria-hidden={!visible}
      aria-label={t('clear')}
      className={visible ? '' : 'invisible'}
      size="icon"
      tabIndex={visible ? 0 : -1}
      type="button"
      variant="ghost"
      onClick={onClick}
    >
      <X />
    </Button>
  );
};
