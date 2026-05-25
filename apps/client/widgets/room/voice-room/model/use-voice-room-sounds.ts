'use client';

import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { useAudio } from '@siberiacancode/reactuse';
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
import { type SoundCategory, useAppSettings } from '@/widgets/app/app-settings';

// Plays Discord-style feedback sounds for room lifecycle events:
//   - join: the local participant and every remote participant
//   - leave: the local participant and every remote participant — via
//     useLeaveSound, whose element lives at the app root so the clip survives
//     the room teardown that fires on the local participant's disconnect
//   - reconnect: the local connection dropping (signal or media level)
//   - mute / unmute: the local participant's microphone toggling
//   - message: a remote participant's chat message while the panel is closed
export const useVoiceRoomSounds = (isChatOpen: boolean) => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const playLeave = useLeaveSound();

  const { settings } = useAppSettings();

  // `interrupt` rewinds the clip so rapid consecutive triggers always fire.
  const joinAudio = useAudio('/audios/user_join.mp3', { interrupt: true });
  const reconnectAudio = useAudio('/audios/reconnect.mp3', { interrupt: true });
  const muteAudio = useAudio('/audios/mute.mp3', { interrupt: true });
  const unmuteAudio = useAudio('/audios/unmute.mp3', { interrupt: true });
  const messageAudio = useAudio('/audios/notification.mp3', { interrupt: true });

  // Sound settings change at runtime; the event-listener effects below capture
  // their callbacks once, so the latest values are read through a ref.
  const soundsRef = useRef(settings.sounds);
  soundsRef.current = settings.sounds;

  // useAudio's `play`/`setVolume` are fresh functions each render but always
  // drive the same internal audio element. The ref is refreshed every render
  // so the guarded wrappers below always call the current functions.
  const audioRef = useRef({
    join: joinAudio,
    reconnect: reconnectAudio,
    mute: muteAudio,
    unmute: unmuteAudio,
    message: messageAudio,
  });
  audioRef.current = {
    join: joinAudio,
    reconnect: reconnectAudio,
    mute: muteAudio,
    unmute: unmuteAudio,
    message: messageAudio,
  };

  // mute/unmute share one toggle; the leave clip lives at the app root, so it
  // has no useAudio element here — its volume is governed by useLeaveSound.
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
    message: guardedPlay('message', 'message'),
  });

  // Read through a ref so the chat effect stays stable across open/close.
  const isChatOpenRef = useRef(isChatOpen);
  isChatOpenRef.current = isChatOpen;

  // The local participant connecting / disconnecting / reconnecting. Leave is
  // also played from cleanup: RoomEvent.Disconnected can arrive after the
  // listener is gone on room switch, so cleanup is the reliable trigger.
  // `hasLeft` guards against playing twice when both paths fire.
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

  // The local participant's microphone toggling. Mute/unmute events also fire
  // for camera/screen-share, so the source is checked before playing.
  useEffect(() => {
    const onMuted = (publication: TrackPublication) => {
      if (publication.source === Track.Source.Microphone) void playRef.current.mute();
    };

    const onUnmuted = (publication: TrackPublication) => {
      if (publication.source === Track.Source.Microphone) void playRef.current.unmute();
    };

    localParticipant.on(ParticipantEvent.TrackMuted, onMuted);
    localParticipant.on(ParticipantEvent.TrackUnmuted, onUnmuted);

    return () => {
      localParticipant.off(ParticipantEvent.TrackMuted, onMuted);
      localParticipant.off(ParticipantEvent.TrackUnmuted, onUnmuted);
    };
  }, [localParticipant]);

  // Remote participants joining / leaving the room.
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

  // A remote participant's chat message, only while the panel is closed.
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
