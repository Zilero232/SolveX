import { type LocalParticipant, Track } from 'livekit-client';

// Flips the underlying MediaStreamTrack on/off without going through
// `setMicrophoneEnabled`. The crucial difference: this does NOT emit
// `ParticipantEvent.TrackMuted`/`TrackUnmuted` — those are reserved for
// explicit user mute. PTT key-down/up uses this so the track listener can
// still tell "user pressed mute" from "PTT pulse" without ref hacks.
export const toggleMicStream = (participant: LocalParticipant, enabled: boolean): boolean => {
  const publication = participant.getTrackPublication(Track.Source.Microphone);
  const stream = publication?.track?.mediaStreamTrack;

  if (!stream) return false;

  stream.enabled = enabled;

  return true;
};
