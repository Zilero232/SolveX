'use client';

import { useMediaDeviceSelect } from '@livekit/components-react';
import { ChevronDownIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';

type MediaDeviceKind = 'audioinput' | 'audiooutput' | 'videoinput';

type DeviceSelectProps = {
  kind: MediaDeviceKind;
  // Some browsers report no audiooutput devices — shown as the trigger label.
  emptyLabel?: string;
};

export const DeviceSelect = ({ kind, emptyLabel = 'No devices found' }: DeviceSelectProps) => {
  // requestPermissions lets the picker enumerate labelled devices even when
  // opened outside a LiveKitRoom (e.g. from the sidebar footer).
  const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({
    kind,
    requestPermissions: true,
  });

  const active = devices.find((device) => device.deviceId === activeDeviceId);
  const triggerLabel = active?.label || devices[0]?.label || emptyLabel;
  const isEmpty = devices.length === 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={s.deviceTrigger} disabled={isEmpty}>
        <span className={s.deviceTriggerLabel}>{triggerLabel}</span>
        <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className={s.deviceMenu}>
        <DropdownMenuRadioGroup
          value={activeDeviceId}
          onValueChange={(deviceId) => void setActiveMediaDevice(deviceId)}
        >
          {devices.map((device) => (
            <DropdownMenuRadioItem key={device.deviceId} value={device.deviceId}>
              {device.label || 'Unknown device'}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
