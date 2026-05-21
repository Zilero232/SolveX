'use client';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';
import type { ToggleChannelsButtonProps } from './ToggleChannelsButton.types';

export const ToggleChannelsButton = ({ opened, onToggle }: ToggleChannelsButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button aria-label="Toggle channels" size="icon" variant="ghost" onClick={onToggle}>
        {opened ? <PanelLeftClose /> : <PanelLeftOpen />}
      </Button>
    </TooltipTrigger>
    <TooltipContent side="right">{opened ? 'Hide channels' : 'Show channels'}</TooltipContent>
  </Tooltip>
);
