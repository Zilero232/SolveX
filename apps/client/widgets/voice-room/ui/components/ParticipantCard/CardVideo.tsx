'use client';

import { type TrackReference, useIsMuted, VideoTrack } from '@livekit/components-react';
import { useFullscreen } from '@siberiacancode/reactuse';
import { Expand } from 'lucide-react';
import type { KeyboardEvent } from 'react';

import { participantCardStyles as s } from './ParticipantCard.styles';

interface CardVideoProps {
  trackRef: TrackReference;
}

/** A single fullscreen-able video pane (camera or screen-share). */
export const CardVideo = ({ trackRef }: CardVideoProps) => {
  const { ref, toggle } = useFullscreen<HTMLDivElement>();
  const muted = useIsMuted(trackRef);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  // A muted camera track is still published; show nothing for it so the avatar wins.
  if (muted) return null;

  return (
    // biome-ignore lint/a11y/useSemanticElements: <button> cannot wrap a <video>; div + role=button is the valid composite
    <div
      ref={ref}
      className={s.videoPane}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <VideoTrack className={s.video} trackRef={trackRef} />
      <div className={s.fullscreenHint}>
        <Expand className={s.hintIcon} />
      </div>
    </div>
  );
};
