'use client';

import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';
import { useDateLocale } from '@/entities/locale';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Progress,
} from '@/shared/ui';
import { parseTauriDate } from '../../lib/parse-tauri-date';
import { updateDialogStyles as s } from './UpdateDialog.styles';
import type { UpdateDialogProps } from './UpdateDialog.types';

export const UpdateDialog = ({
  status,
  currentVersion,
  version,
  date,
  progress,
  onInstall,
  onDismiss,
}: UpdateDialogProps) => {
  const t = useTranslations('update');
  const dateLocale = useDateLocale();

  const isBusy = status === 'downloading' || status === 'installing';
  const open = status !== 'idle';

  const parsedDate = parseTauriDate(date);

  const releaseDate = parsedDate ? format(parsedDate, 'd MMM yyyy', { locale: dateLocale }) : date;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !isBusy) onDismiss();
      }}
    >
      <DialogContent
        showCloseButton={!isBusy}
        onEscapeKeyDown={(event) => {
          if (isBusy) event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (isBusy) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (isBusy) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description', { version: version ?? '' })}</DialogDescription>
        </DialogHeader>

        <div className={s.meta}>
          {currentVersion && (
            <div className={s.metaRow}>
              <span className={s.versionPill}>{currentVersion}</span>
              <span>→</span>
              <span className={s.versionPill}>{version}</span>
            </div>
          )}
          {releaseDate && <span>{t('releasedOn', { date: releaseDate })}</span>}
        </div>

        {match(status)
          .with(P.union('downloading', 'installing'), (current) => (
            <div className={s.progressWrap}>
              <Progress value={current === 'installing' ? 100 : progress} />

              <div className={s.progressLabel}>
                <span>
                  {current === 'installing'
                    ? t('installing')
                    : t('downloading', { percent: progress })}
                </span>
              </div>
            </div>
          ))
          .with('error', () => <p className={s.error}>{t('failed')}</p>)
          .otherwise(() => null)}

        {!isBusy && (
          <DialogFooter>
            <Button variant="outline" onClick={onDismiss}>
              {t('later')}
            </Button>
            <Button onClick={onInstall} disabled={status === 'error'}>
              {t('install')}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
