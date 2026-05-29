'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { Copy, Volume1, Volume2, VolumeX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Slider,
} from '@/shared/ui';
import { useParticipantVolume } from '../../../model';
import { participantCardMenuStyles as s } from './ParticipantCardMenu.styles';
import type { ParticipantCardMenuProps } from './ParticipantCardMenu.types';

export const ParticipantCardMenu = ({ participant, children }: ParticipantCardMenuProps) => {
  const t = useTranslations('participant');

  const { isMuted, volume, isControllable, setVolume, toggleMute } =
    useParticipantVolume(participant);

  const { copy } = useCopy();

  const displayName = participant.name || participant.identity;

  const handleCopyName = async () => {
    await copy(displayName);

    toast.success(t('nameCopied'));
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent className={s.content}>
        <ContextMenuLabel>{displayName}</ContextMenuLabel>

        {isControllable && (
          <>
            <ContextMenuSeparator />

            <ContextMenuItem onSelect={toggleMute}>
              {isMuted ? <Volume2 /> : <VolumeX />}
              {isMuted ? t('unmuteForMe') : t('muteForMe')}
            </ContextMenuItem>

            <ContextMenuItem className={s.volumeItem} onSelect={(event) => event.preventDefault()}>
              <div className={s.volumeRow}>
                <span className="flex items-center gap-2">
                  <Volume1 />
                  {t('volume')}
                </span>
                <span className={s.volumeValue}>{Math.round(volume * 100)}%</span>
              </div>

              <Slider
                aria-label={t('volumeFor', { name: displayName })}
                max={1}
                min={0}
                step={0.05}
                value={[volume]}
                onValueChange={([next]) => setVolume(next)}
              />
            </ContextMenuItem>
          </>
        )}

        <ContextMenuSeparator />

        <ContextMenuItem onSelect={handleCopyName}>
          <Copy />
          {t('copyName')}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
