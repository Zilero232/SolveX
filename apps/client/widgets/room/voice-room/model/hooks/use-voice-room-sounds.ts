'use client';

import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { useAudio, usePrevious } from '@siberiacancode/reactuse';
import {
  type LocalParticipant,
  ParticipantEvent,
  type RemoteParticipant,
  RoomEvent,
  Track,
  type TrackPublication,
} from 'livekit-client';
import { useEffect, useRef } from 'react';
import { useLeaveSound } from '@/entities/room/room';
import { useDeafen } from '@/features/room/room-control';
import { appBus } from '@/shared/lib';
import { type SoundCategory, useAppSettings } from '@/widgets/app/app-settings';

export const useVoiceRoomSounds = (isChatOpen: boolean) => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const playLeave = useLeaveSound();

  const { isDeafened } = useDeafen();
  const { settings } = useAppSettings();

  const joinAudio = useAudio('/audios/user_join.mp3', { interrupt: true });
  const reconnectAudio = useAudio('/audios/reconnect.mp3', { interrupt: true });
  const muteAudio = useAudio('/audios/mute.mp3', { interrupt: true });
  const unmuteAudio = useAudio('/audios/unmute.mp3', { interrupt: true });
  const pttAudio = useAudio('/audios/ptt.mp3', { interrupt: true });
  const deafenAudio = useAudio('/audios/deafen.mp3', { interrupt: true });
  const undeafenAudio = useAudio('/audios/undeafen.mp3', { interrupt: true });
  const messageAudio = useAudio('/audios/notification.mp3', { interrupt: true });

  const soundsRef = useRef(settings.sounds);
  soundsRef.current = settings.sounds;

  const audioRef = useRef({
    join: joinAudio,
    reconnect: reconnectAudio,
    mute: muteAudio,
    unmute: unmuteAudio,
    ptt: pttAudio,
    deafen: deafenAudio,
    undeafen: undeafenAudio,
    message: messageAudio,
  });

  const guardedPlay = (category: SoundCategory, key: keyof typeof audioRef.current) => {
    return () => {
      const { enabled, volume } = soundsRef.current;
      if (!enabled[category]) return;

      const audio = audioRef.current[key];
      audio.setVolume(volume);

      void audio.play();
    };
  };

  const playRef = useRef({
    join: guardedPlay('join', 'join'),
    leave: () => {
      if (soundsRef.current.enabled.leave) playLeave();
    },
    reconnect: guardedPlay('reconnect', 'reconnect'),
    mute: guardedPlay('mute', 'mute'),
    unmute: guardedPlay('mute', 'unmute'),
    ptt: guardedPlay('mute', 'ptt'),
    deafen: guardedPlay('mute', 'deafen'),
    undeafen: guardedPlay('mute', 'undeafen'),
    message: guardedPlay('message', 'message'),
  });

  const isChatOpenRef = useRef(isChatOpen);
  isChatOpenRef.current = isChatOpen;

  appBus.useSubscribe('pttHold', () => {
    void playRef.current.ptt();
  });

  const prevDeafened = usePrevious(isDeafened);

  useEffect(() => {
    if (prevDeafened === undefined || prevDeafened === isDeafened) return;

    if (isDeafened) void playRef.current.deafen();
    else void playRef.current.undeafen();
  }, [isDeafened, prevDeafened]);

  useEffect(() => {
    if (room.state === 'connected') void playRef.current.join();

    let hasLeft = false;
    const playLeave = () => {
      if (hasLeft) return;
      hasLeft = true;

      playRef.current.leave();
    };

    const onConnected = () => {
      return void playRef.current.join();
    };
    const onReconnecting = () => {
      return void playRef.current.reconnect();
    };

    room.on(RoomEvent.Connected, onConnected);
    room.on(RoomEvent.Disconnected, playLeave);
    room.on(RoomEvent.Reconnecting, onReconnecting);
    room.on(RoomEvent.SignalReconnecting, onReconnecting);

    return () => {
      room.off(RoomEvent.Connected, onConnected);
      room.off(RoomEvent.Disconnected, playLeave);
      room.off(RoomEvent.Reconnecting, onReconnecting);
      room.off(RoomEvent.SignalReconnecting, onReconnecting);

      playLeave();
    };
  }, [room]);

  useEffect(() => {
    const onMuted = (publication: TrackPublication) => {
      if (publication.source !== Track.Source.Microphone) return;

      void playRef.current.mute();
    };

    const onUnmuted = (publication: TrackPublication) => {
      if (publication.source !== Track.Source.Microphone) return;

      void playRef.current.unmute();
    };

    localParticipant.on(ParticipantEvent.TrackMuted, onMuted);
    localParticipant.on(ParticipantEvent.TrackUnmuted, onUnmuted);

    return () => {
      localParticipant.off(ParticipantEvent.TrackMuted, onMuted);
      localParticipant.off(ParticipantEvent.TrackUnmuted, onUnmuted);
    };
  }, [localParticipant]);

  useEffect(() => {
    const onJoin = () => {
      return void playRef.current.join();
    };
    const onLeave = () => {
      return void playRef.current.leave();
    };

    room.on(RoomEvent.ParticipantConnected, onJoin);
    room.on(RoomEvent.ParticipantDisconnected, onLeave);

    return () => {
      room.off(RoomEvent.ParticipantConnected, onJoin);
      room.off(RoomEvent.ParticipantDisconnected, onLeave);
    };
  }, [room]);

  useEffect(() => {
    const onMessage = (_message: unknown, participant?: RemoteParticipant | LocalParticipant) => {
      const isOwn = participant?.identity === localParticipant.identity;
      if (isOwn || isChatOpenRef.current) return;

      void playRef.current.message();
    };

    room.on(RoomEvent.ChatMessage, onMessage);

    return () => {
      room.off(RoomEvent.ChatMessage, onMessage);
    };
  }, [room, localParticipant]);
};
