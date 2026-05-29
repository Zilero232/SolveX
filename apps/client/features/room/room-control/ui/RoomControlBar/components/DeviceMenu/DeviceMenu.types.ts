import type { DeviceSettings } from '@/widgets/app/app-settings';

export type DeviceMenuProps = {
  kind: MediaDeviceKind;
  slot: keyof DeviceSettings;
  label: string;
};
