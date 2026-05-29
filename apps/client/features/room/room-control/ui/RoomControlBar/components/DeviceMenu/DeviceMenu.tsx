'use client';

import { useMediaDeviceSelect } from '@livekit/components-react';
import { ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui';
import { useAppSettings } from '@/widgets/app/app-settings';
import { deviceMenuStyles as s } from './DeviceMenu.styles';
import type { DeviceMenuProps } from './DeviceMenu.types';

export const DeviceMenu = ({ kind, slot, label }: DeviceMenuProps) => {
  const t = useTranslations('settings.devices');
  const { settings, setGroup } = useAppSettings();

  const { devices } = useMediaDeviceSelect({ kind, requestPermissions: true });

  const selectedId = settings.devices[slot];
  const activeDevice = devices.find((device) => device.deviceId === selectedId);

  const selectDevice = (deviceId: string) => {
    setGroup('devices', { [slot]: deviceId });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={label} className={s.trigger} disabled={isEmpty(devices)}>
        <ChevronUp className={s.triggerIcon} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className={s.menu} side="top">
        <DropdownMenuRadioGroup
          value={activeDevice?.deviceId ?? selectedId}
          onValueChange={selectDevice}
        >
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
