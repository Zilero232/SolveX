import type { VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import type { DeviceSettings } from '@/widgets/app/app-settings';
import type { controlButton } from './ControlButton.styles';

type ControlTone = NonNullable<VariantProps<typeof controlButton>['tone']>;

export type ControlDevice = {
  kind: MediaDeviceKind;
  slot: keyof DeviceSettings;
  label: string;
};

export type ControlButtonProps = {
  icon: ReactNode;
  label: string;
  tone: ControlTone;
  pressed?: boolean;
  disabled?: boolean;
  device?: ControlDevice;
  onClick: () => void;
};
