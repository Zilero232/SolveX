'use client';

import { useMediaDeviceSelect } from '@livekit/components-react';
import { ChevronDownIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui';
import { KIND_TO_SLOT } from '../../config/config';
import { useAppSettings } from '../../model/hooks';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';

type DeviceSelectProps = {
  kind: MediaDeviceKind;
  emptyLabel?: string;
};

export const DeviceSelect = ({ kind, emptyLabel }: DeviceSelectProps) => {
  const t = useTranslations('settings.devices');
  const { settings, setGroup } = useAppSettings();

  const slot = KIND_TO_SLOT[kind];

  const { devices } = useMediaDeviceSelect({ kind, requestPermissions: true });

  const selectedId = settings.devices[slot];
  const active = devices.find((device) => device.deviceId === selectedId);

  const triggerLabel = active?.label || devices[0]?.label || emptyLabel || t('noDevices');

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
              {device.label || t('unknownDevice')}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
