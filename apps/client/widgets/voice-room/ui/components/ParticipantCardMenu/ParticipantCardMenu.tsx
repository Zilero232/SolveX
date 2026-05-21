'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { Copy, Volume1, Volume2, VolumeX } from 'lucide-react';
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

// All controls are local to the current listener — they affect nobody else.
export const ParticipantCardMenu = ({ participant, children }: ParticipantCardMenuProps) => {
  const { isMuted, volume, isControllable, setVolume, toggleMute } =
    useParticipantVolume(participant);

  const { copy } = useCopy();

  const displayName = participant.name || participant.identity;

  const handleCopyName = async () => {
    await copy(displayName);

    toast.success('Name copied');
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
              {isMuted ? 'Unmute for me' : 'Mute for me'}
            </ContextMenuItem>

            {/* Keep the menu open while dragging the slider. */}
            <ContextMenuItem className={s.volumeItem} onSelect={(event) => event.preventDefault()}>
              <div className={s.volumeRow}>
                <span className="flex items-center gap-2">
                  <Volume1 />
                  Volume
                </span>
                <span className={s.volumeValue}>{Math.round(volume * 100)}%</span>
              </div>

              <Slider
                aria-label={`Volume for ${displayName}`}
                max={2}
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
          Copy name
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
