'use client';

import { isRegistered, register, unregister } from '@tauri-apps/plugin-global-shortcut';
import { TriangleAlert, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { entries, isNullish } from 'remeda';
import { toast } from 'sonner';
import { match, P } from 'ts-pattern';
import { useShortcutConflict } from '@/features/app/shortcuts';
import { useRecordShortcut } from '@/shared/hooks';
import { cn, hasModifier, isFunctionKey, prettyAccelerator } from '@/shared/lib';
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui';
import type { ShortcutActionId, ShortcutBinding, ShortcutSettings } from '../../model/types';

type ShortcutRowProps = {
  actionId: ShortcutActionId;
  label: string;
  binding: ShortcutBinding;
  allBindings: ShortcutSettings;
  onChange: (next: ShortcutBinding) => void;
};

const findConflict = (
  candidate: string,
  selfId: ShortcutActionId,
  all: ShortcutSettings,
): ShortcutActionId | null =>
  entries(all).find(([id, value]) => id !== selfId && value === candidate)?.[0] ?? null;

export const ShortcutRow = ({
  actionId,
  label,
  binding,
  allBindings,
  onChange,
}: ShortcutRowProps) => {
  const t = useTranslations('settings.shortcuts');
  const tActions = useTranslations('settings.shortcuts.actions');

  const [recording, setRecording] = useState(false);
  const hasConflict = useShortcutConflict(binding);

  useRecordShortcut({
    enabled: recording,
    onCancel: () => setRecording(false),
    onCommit: async (accelerator) => {
      if (!hasModifier(accelerator) && !isFunctionKey(accelerator)) {
        toast.error(t('errors.needsModifier'));
        setRecording(false);
        return;
      }

      const conflict = findConflict(accelerator, actionId, allBindings);
      if (conflict !== null) {
        toast.error(t('errors.duplicate', { action: tActions(conflict) }));
        setRecording(false);
        return;
      }

      // Skip OS-availability probe if our own bridge already owns this
      // accelerator — register() would throw "HotKey already registered"
      // for ourselves and we'd misreport it as systemTaken.
      const ownedByUs = await isRegistered(accelerator).catch(() => false);
      if (!ownedByUs) {
        try {
          await register(accelerator, () => {});
          await unregister(accelerator);
        } catch {
          toast.error(t('errors.systemTaken'));
          setRecording(false);
          return;
        }
      }

      onChange(accelerator);
      setRecording(false);
    },
  });

  const display = match({ recording, binding })
    .with({ recording: true }, () => t('recording'))
    .with({ binding: P.nullish }, () => t('unassigned'))
    .otherwise(({ binding: b }) => prettyAccelerator(b as string));
  const clearVisible = !isNullish(binding) && !recording;

  const showConflictHint = hasConflict && !recording;

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="font-medium text-sm">{label}</span>

      <div className="flex items-center gap-2">
        <TooltipProvider delayDuration={150}>
          <Tooltip open={showConflictHint ? undefined : false}>
            <TooltipTrigger asChild>
              <Button
                aria-label={recording ? t('recording') : label}
                className={cn(
                  'w-55 justify-center gap-2 font-mono text-xs',
                  showConflictHint &&
                    'border-amber-500/40 bg-amber-500/6 text-amber-200 hover:bg-amber-500/10',
                )}
                type="button"
                variant="outline"
                onClick={() => setRecording(true)}
              >
                {showConflictHint ? (
                  <TriangleAlert aria-hidden className="size-3.5 shrink-0 text-amber-400" />
                ) : null}
                <span>{display}</span>
              </Button>
            </TooltipTrigger>
            {showConflictHint ? (
              <TooltipContent
                className="max-w-50 text-wrap border border-amber-500/40 bg-popover text-center text-amber-200 leading-snug [&>span:last-child]:bg-popover [&>span:last-child]:fill-popover"
                side="top"
                sideOffset={6}
              >
                {t('errors.systemTaken')}
              </TooltipContent>
            ) : null}
          </Tooltip>
        </TooltipProvider>

        <Button
          aria-hidden={!clearVisible}
          aria-label={t('clear')}
          className={clearVisible ? '' : 'invisible'}
          size="icon"
          tabIndex={clearVisible ? 0 : -1}
          type="button"
          variant="ghost"
          onClick={() => onChange(null)}
        >
          <X />
        </Button>
      </div>
    </div>
  );
};
