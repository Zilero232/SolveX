'use client';

import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { useAudio, usePrevious } from '@siberiacancode/reactuse';
import { ParticipantEvent, RoomEvent, Track, type TrackPublication } from 'livekit-client';
import { useEffect, useRef } from 'react';
import { useLeaveSound } from '@/entities/room/room';
import { useDeafen } from '@/features/room/room-control';
import { useEmitterEvent } from '@/shared/hooks';
import { appBus } from '@/shared/lib';
import { useAppSettings } from '@/widgets/app/app-settings';
import { SOUND_CATEGORY, SOUND_SRC, type SoundKey } from '../../config';

export const useVoiceRoomSounds = () => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const playLeave = useLeaveSound();

  const { isDeafened } = useDeafen();
  const { settings } = useAppSettings();

  const audioRef = useRef<Record<SoundKey, ReturnType<typeof useAudio>>>({
    join: useAudio(SOUND_SRC.join, { interrupt: true }),
    reconnect: useAudio(SOUND_SRC.reconnect, { interrupt: true }),
    mute: useAudio(SOUND_SRC.mute, { interrupt: true }),
    unmute: useAudio(SOUND_SRC.unmute, { interrupt: true }),
    ptt: useAudio(SOUND_SRC.ptt, { interrupt: true }),
    deafen: useAudio(SOUND_SRC.deafen, { interrupt: true }),
    undeafen: useAudio(SOUND_SRC.undeafen, { interrupt: true }),
    message: useAudio(SOUND_SRC.message, { interrupt: true }),
  });

  const soundsRef = useRef(settings.sounds);
  soundsRef.current = settings.sounds;

  const play = (key: SoundKey) => {
    const { enabled, volume } = soundsRef.current;
    if (!enabled[SOUND_CATEGORY[key]]) return;

    const audio = audioRef.current[key];
    audio.setVolume(volume);
    audio.play();
  };

  const playLeaveSound = () => {
    if (soundsRef.current.enabled.leave) playLeave();
  };

  const hasLeftRef = useRef(false);
  const playOwnLeaveOnce = () => {
    if (hasLeftRef.current) return;
    hasLeftRef.current = true;

    playLeaveSound();
  };

  const playRef = useRef({ play, playLeaveSound, playOwnLeaveOnce });
  playRef.current = { play, playLeaveSound, playOwnLeaveOnce };

  appBus.useSubscribe('pttHold', () => playRef.current.play('ptt'));
  appBus.useSubscribe('chatMessage', () => playRef.current.play('message'));

  const prevDeafened = usePrevious(isDeafened);

  useEffect(() => {
    if (prevDeafened === undefined || prevDeafened === isDeafened) return;

    playRef.current.play(isDeafened ? 'deafen' : 'undeafen');
  }, [isDeafened, prevDeafened]);

  useEffect(() => {
    hasLeftRef.current = false;

    if (room.state === 'connected') playRef.current.play('join');

    return () => playRef.current.playOwnLeaveOnce();
  }, [room]);

  useEmitterEvent(room, RoomEvent.Connected, () => playRef.current.play('join'));
  useEmitterEvent(room, RoomEvent.Reconnecting, () => playRef.current.play('reconnect'));
  useEmitterEvent(room, RoomEvent.SignalReconnecting, () => playRef.current.play('reconnect'));
  useEmitterEvent(room, RoomEvent.Disconnected, () => playRef.current.playOwnLeaveOnce());
  useEmitterEvent(room, RoomEvent.ParticipantConnected, () => playRef.current.play('join'));
  useEmitterEvent(room, RoomEvent.ParticipantDisconnected, () => playRef.current.playLeaveSound());

  useEmitterEvent(
    localParticipant,
    ParticipantEvent.TrackMuted,
    (publication: TrackPublication) => {
      if (publication.source === Track.Source.Microphone) playRef.current.play('mute');
    },
  );

  useEmitterEvent(
    localParticipant,
    ParticipantEvent.TrackUnmuted,
    (publication: TrackPublication) => {
      if (publication.source === Track.Source.Microphone) playRef.current.play('unmute');
    },
  );
};
