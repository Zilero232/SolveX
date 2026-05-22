'use client';

import { useMediaDeviceSelect } from '@livekit/components-react';
import { ChevronDownIcon } from 'lucide-react';
import { isEmpty } from 'remeda';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui';
import { KIND_TO_SLOT, useAppSettings } from '../../model';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';

type DeviceSelectProps = {
  // MediaDeviceKind is the built-in DOM type; useMediaDeviceSelect expects it.
  kind: MediaDeviceKind;
  // Some browsers report no audiooutput devices — shown as the trigger label.
  emptyLabel?: string;
};

export const DeviceSelect = ({ kind, emptyLabel = 'No devices found' }: DeviceSelectProps) => {
  const { settings, setGroup } = useAppSettings();

  const slot = KIND_TO_SLOT[kind];

  // This dialog opens from the sidebar, outside LiveKitRoom, so a room-bound
  // useMediaDeviceSelect is not available. The hook is used here only to
  // enumerate devices (requestPermissions unlocks the labels); the choice is
  // persisted to the store, and useDeviceSync — running inside the room —
  // applies it to the live room and mirrors back any external switch.
  const { devices } = useMediaDeviceSelect({ kind, requestPermissions: true });

  const selectedId = settings.devices[slot];
  const active = devices.find((device) => device.deviceId === selectedId);

  // Prefer the selected device's label, fall back to the first device, then to
  // the empty-state text when nothing is enumerated.
  const triggerLabel = active?.label || devices[0]?.label || emptyLabel;

  const selectDevice = (deviceId: string) => {
    setGroup('devices', { [slot]: deviceId });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={s.deviceTrigger} disabled={isEmpty(devices)}>
        <span className={s.deviceTriggerLabel}>{triggerLabel}</span>
        <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className={s.deviceMenu}>
        <DropdownMenuRadioGroup value={selectedId} onValueChange={selectDevice}>
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
