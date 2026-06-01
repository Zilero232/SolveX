import type { SoundCategory } from '@/widgets/app/app-settings';

export const SOUND_SRC = {
  join: '/audios/user_join.mp3',
  reconnect: '/audios/reconnect.mp3',
  mute: '/audios/mute.mp3',
  unmute: '/audios/unmute.mp3',
  ptt: '/audios/ptt.mp3',
  deafen: '/audios/deafen.mp3',
  undeafen: '/audios/undeafen.mp3',
  message: '/audios/notification.mp3',
} as const;

export type SoundKey = keyof typeof SOUND_SRC;

export const SOUND_CATEGORY: Record<SoundKey, SoundCategory> = {
  join: 'join',
  reconnect: 'reconnect',
  mute: 'mute',
  unmute: 'mute',
  ptt: 'mute',
  deafen: 'mute',
  undeafen: 'mute',
  message: 'message',
};
