'use client';

import { type TrackReference, useIsMuted, VideoTrack } from '@livekit/components-react';
import { useFullscreen } from '@siberiacancode/reactuse';
import { Expand } from 'lucide-react';
import { useAppSettings } from '@/widgets/app-settings';
import { cardVideoStyles as s } from './CardVideo.styles';
import type { KeyboardEvent } from 'react';

type CardVideoProps = {
  trackRef: TrackReference;
};

export const CardVideo = ({ trackRef }: CardVideoProps) => {
  const { ref, toggle } = useFullscreen<HTMLDivElement>();
  const muted = useIsMuted(trackRef);

  const { settings } = useAppSettings();

  // Mirror applies only to the local participant's own preview — remote
  // participants are always shown unmirrored, as they really appear.
  const isMirrored = trackRef.participant.isLocal && settings.mirrorVideo;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  // A muted camera track is still published; show nothing for it.
  if (muted) return null;

  return (
    // biome-ignore lint/a11y/useSemanticElements: <button> cannot wrap a <video>; div + role=button is the valid composite
    <div
      ref={ref}
      className={s.pane}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <VideoTrack className={isMirrored ? s.videoMirrored : s.video} trackRef={trackRef} />
      <div className={s.fullscreenHint}>
        <Expand className={s.hintIcon} />
      </div>
    </div>
  );
};
