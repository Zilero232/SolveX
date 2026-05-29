'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';
import { DeviceMenu } from '../DeviceMenu';
import { controlButton, controlButtonStyles as s } from './ControlButton.styles';
import type { ControlButtonProps } from './ControlButton.types';

export const ControlButton = ({
  icon,
  label,
  tone,
  pressed,
  disabled,
  device,
  onClick,
}: ControlButtonProps) => {
  return (
    <div className={s.group}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-label={label}
            aria-pressed={pressed}
            className={controlButton({ tone })}
            disabled={disabled}
            type="button"
            onClick={onClick}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>

      {device && <DeviceMenu kind={device.kind} label={device.label} slot={device.slot} />}
    </div>
  );
};
