import type { DeviceSettings } from '@/widgets/app/app-settings';

export type RoomControlDevice = {
  kind: MediaDeviceKind;
  slot: keyof DeviceSettings;
  labelKey: 'micDevice' | 'camDevice' | 'speakerDevice';
};

export const MIC_DEVICE: RoomControlDevice = {
  kind: 'audioinput',
  slot: 'audioInput',
  labelKey: 'micDevice',
};

export const CAM_DEVICE: RoomControlDevice = {
  kind: 'videoinput',
  slot: 'videoInput',
  labelKey: 'camDevice',
};

export const SPEAKER_DEVICE: RoomControlDevice = {
  kind: 'audiooutput',
  slot: 'audioOutput',
  labelKey: 'speakerDevice',
};
