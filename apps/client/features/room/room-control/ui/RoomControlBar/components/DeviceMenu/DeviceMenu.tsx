'use client';

import { useMediaDeviceSelect } from '@livekit/components-react';
import { Check, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';
import { cn } from '@/shared/lib/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui';
import { useAppSettings } from '@/widgets/app/app-settings';
import { deviceMenuStyles as s } from './DeviceMenu.styles';
import { deviceIcon } from './lib/device-icon';
import type { DeviceMenuProps } from './DeviceMenu.types';

export const DeviceMenu = ({ kind, slot, label }: DeviceMenuProps) => {
  const t = useTranslations('settings.devices');
  const { settings, setGroup } = useAppSettings();

  const { devices } = useMediaDeviceSelect({ kind, requestPermissions: true });

  const selectedId = settings.devices[slot];
  const activeDevice = devices.find((device) => device.deviceId === selectedId);
  const activeId = activeDevice?.deviceId ?? selectedId;

  const selectDevice = (deviceId: string) => {
    setGroup('devices', { [slot]: deviceId });
  };

  const Icon = deviceIcon(kind);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={label} className={s.trigger} disabled={isEmpty(devices)}>
        <ChevronUp className={s.triggerIcon} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className={s.menu} side="top">
        <div className={s.header}>
          <Icon className={s.headerIcon} />
          <span className={s.headerLabel}>{label}</span>
        </div>

        <DropdownMenuRadioGroup className={s.list} value={activeId} onValueChange={selectDevice}>
          {devices.map((device) => {
            const name = device.label || t('unknownDevice');
            const isActive = device.deviceId === activeId;

            return (
              <DropdownMenuRadioItem
                key={device.deviceId}
                className={cn(s.item, isActive ? s.itemActive : s.itemInactive)}
                value={device.deviceId}
              >
                <span className={cn(s.itemIconBox, isActive && s.itemIconBoxActive)}>
                  <Icon />
                </span>
                <span className={s.itemLabel} title={name}>
                  {name}
                </span>
                {isActive && <Check className={s.itemCheck} />}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
