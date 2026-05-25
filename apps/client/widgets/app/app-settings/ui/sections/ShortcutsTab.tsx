'use client';

import { isTauri } from '@tauri-apps/api/core';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { EXTERNAL_LINKS } from '@/shared/constants';
import { useAppSettings } from '../../model';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { ShortcutRow } from '../components/ShortcutRow';
import type { ShortcutActionId } from '../../model/types';

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

export const ShortcutsTab = () => {
  const tActions = useTranslations('settings.shortcuts.actions');
  const { settings, setGroup } = useAppSettings();

  const bindings = settings.shortcuts;

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
        <ShortcutRow
          key={actionId}
          actionId={actionId}
          allBindings={bindings}
          binding={bindings[actionId]}
          label={tActions(actionId)}
          onChange={(next) => setGroup('shortcuts', { ...bindings, [actionId]: next })}
        />
      ))}
    </div>
  );
};
