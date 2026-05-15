'use client';

import { Home, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { supabase } from '@/shared/api';
import { ROUTES } from '@/shared/constants';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui';

import type { ServerRailProps } from './ServerRail.types';

import { serverRailStyles as s } from './ServerRail.styles';

export const ServerRail = ({ channelsOpened, onToggleChannels }: ServerRailProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) toast.error(error.message);
  };

  return (
    <div className={s.root}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="Toggle channels"
            size="icon"
            variant="ghost"
            onClick={onToggleChannels}
          >
            {channelsOpened ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {channelsOpened ? 'Hide channels' : 'Show channels'}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="Lobby"
            size="icon"
            variant="ghost"
            onClick={() => router.replace(ROUTES.lobby)}
          >
            <Home />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Lobby</TooltipContent>
      </Tooltip>

      <div className={s.spacer} />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button aria-label="Logout" size="icon" variant="ghost" onClick={handleLogout}>
            <LogOut />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Logout</TooltipContent>
      </Tooltip>
    </div>
  );
};
