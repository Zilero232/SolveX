'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { isTauri } from '@tauri-apps/api/core';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isNullish } from 'remeda';
import {
  formatBindingDisplay,
  SHORTCUT_ACTIONS,
  type ShortcutActionId,
  ShortcutRow,
} from '@/entities/app/shortcut';
import { DownloadAppDialog } from '@/features/app/download-app';
import { useShortcutConflict, useShortcutRecording } from '@/features/app/shortcuts';
import { useAppSettings } from '../../model';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';

const WebNotice = () => {
  const t = useTranslations('settings.shortcuts');
  const [isOpen, toggleOpen] = useBoolean(false);

  return (
    <>
      <div className="flex items-start gap-3 rounded-lg border border-brand-cyan/40 bg-brand-cyan/10 p-4 text-sm backdrop-blur-md">
        <Info className="mt-0.5 size-4 shrink-0 text-brand-cyan" />
        <p className="leading-relaxed">
          {t.rich('webNotice', {
            link: (chunks) => (
              <button
                className="font-medium text-brand-cyan underline-offset-2 hover:underline"
                onClick={() => toggleOpen(true)}
                type="button"
              >
                {chunks}
              </button>
            ),
          })}
        </p>
      </div>

      <DownloadAppDialog open={isOpen} onOpenChange={toggleOpen} />
    </>
  );
};

type ActionRowProps = {
  actionId: ShortcutActionId;
};

const ActionRow = ({ actionId }: ActionRowProps) => {
  const t = useTranslations('settings.shortcuts');
  const tActions = useTranslations('settings.shortcuts.actions');
  const { settings, setGroup } = useAppSettings();

  const bindings = settings.shortcuts;
  const binding = bindings[actionId];

  const { recording, start } = useShortcutRecording({
    actionId,
    allBindings: bindings,
    onPatch: (patch) => setGroup('shortcuts', { ...bindings, ...patch }),
  });

  const hasConflict = useShortcutConflict(binding);

  const display = formatBindingDisplay(recording, binding, {
    recording: t('recording'),
    unassigned: t('unassigned'),
  });

  return (
    <ShortcutRow
      clearVisible={!isNullish(binding) && !recording}
      display={display}
      label={tActions(actionId)}
      recording={recording}
      showConflictHint={hasConflict && !recording}
      onClear={() => setGroup('shortcuts', { ...bindings, [actionId]: null })}
      onRecord={start}
    />
  );
};

export const ShortcutsTab = () => {
  if (!isTauri()) {
    return (
      <div className={s.tabPanel}>
        <WebNotice />
      </div>
    );
  }

  return (
    <div className={s.tabPanel}>
      {Object.values(SHORTCUT_ACTIONS).map((actionId) => (
        <ActionRow key={actionId} actionId={actionId} />
      ))}
    </div>
  );
};
