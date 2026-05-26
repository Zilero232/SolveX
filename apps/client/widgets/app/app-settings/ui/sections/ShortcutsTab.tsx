'use client';

import { isTauri } from '@tauri-apps/api/core';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isNullish } from 'remeda';
import { formatBindingDisplay, type ShortcutActionId, ShortcutRow } from '@/entities/app/shortcut';
import { useShortcutConflict, useShortcutRecording } from '@/features/app/shortcuts';
import { EXTERNAL_LINKS } from '@/shared/constants';
import { useAppSettings } from '../../model';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';

const ACTIONS: ShortcutActionId[] = ['muteToggle', 'pttHold'];

const WebNotice = () => {
  const t = useTranslations('settings.shortcuts');

  return (
    <div className="flex items-start gap-3 rounded-md border border-sky-500/40 bg-sky-500/10 p-4 text-sm">
      <Info className="mt-0.5 size-4 shrink-0 text-sky-400" />
      <p className="leading-relaxed">
        {t.rich('webNotice', {
          link: (chunks) => (
            <a
              className="underline underline-offset-2 hover:text-sky-300"
              href={EXTERNAL_LINKS.desktopReleases}
              rel="noreferrer"
              target="_blank"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
    </div>
  );
};

type ActionRowProps = {
  actionId: ShortcutActionId;
};

// Wires the stateless entity row to feature hooks (recording flow + conflict
// store) and to the settings store. Lives here, not in the entity, because
// FSD forbids entities from pulling features.
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
      {ACTIONS.map((actionId) => (
        <ActionRow key={actionId} actionId={actionId} />
      ))}
    </div>
  );
};
