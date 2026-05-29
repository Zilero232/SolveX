'use client';

import {
  HeadphoneOff,
  Headphones,
  LogOut,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  Video,
  VideoOff,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRoomControls } from '../../model/hooks/use-room-controls';
import { ControlButton, ReactionButton } from './components';
import { roomControlBarStyles as s } from './RoomControlBar.styles';
import type { ControlDevice } from './components';

const MIC_DEVICE: ControlDevice = { kind: 'audioinput', slot: 'audioInput', label: 'micDevice' };
const CAM_DEVICE: ControlDevice = { kind: 'videoinput', slot: 'videoInput', label: 'camDevice' };
const SPEAKER_DEVICE: ControlDevice = {
  kind: 'audiooutput',
  slot: 'audioOutput',
  label: 'speakerDevice',
};

export const RoomControlBar = () => {
  const t = useTranslations('room.controls');

  const { mic, camera, screen, deafen, leave } = useRoomControls();

  const micLabel = mic.pttKey ? `${t(mic.labelKey)} · ${mic.pttKey}` : t(mic.labelKey);

  return (
    <div className={s.root}>
      <ControlButton
        device={{ ...MIC_DEVICE, label: t('micDevice') }}
        icon={mic.isMuted ? <MicOff /> : <Mic />}
        label={micLabel}
        pressed={mic.isMuted}
        tone={mic.tone}
        onClick={mic.toggle}
      />

      <ControlButton
        device={{ ...SPEAKER_DEVICE, label: t('speakerDevice') }}
        icon={deafen.active ? <HeadphoneOff /> : <Headphones />}
        label={deafen.active ? t('undeafen') : t('deafen')}
        pressed={deafen.active}
        tone={deafen.active ? 'danger' : 'off'}
        onClick={deafen.toggle}
      />

      <ControlButton
        device={{ ...CAM_DEVICE, label: t('camDevice') }}
        icon={camera.enabled ? <Video /> : <VideoOff />}
        label={camera.enabled ? t('cameraOff') : t('camera')}
        pressed={camera.enabled}
        tone={camera.enabled ? 'active' : 'off'}
        onClick={camera.toggle}
      />

      <ControlButton
        icon={screen.enabled ? <MonitorOff /> : <Monitor />}
        label={screen.enabled ? t('stopShare') : t('screenShare')}
        pressed={screen.enabled}
        tone={screen.enabled ? 'active' : 'off'}
        onClick={screen.toggle}
      />

      <ReactionButton />

      <span aria-hidden className={s.divider} />

      <ControlButton icon={<LogOut />} label={t('leave')} tone="leave" onClick={leave} />
    </div>
  );
};
