'use client';

import { Home, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { supabase } from '@/shared/api';
import { ROUTES } from '@/shared/constants';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

import { serverRailStyles as s } from './ServerRail.styles';
import type { ServerRailProps } from './ServerRail.types';

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
            variant="ghost"
            size="icon"
            onClick={onToggleChannels}
            aria-label="Toggle channels"
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
          <button type="button" onClick={() => router.replace(ROUTES.lobby)} className={s.logo}>
            <Avatar className={s.logoAvatar}>
              <AvatarFallback className={s.logoFallback}>S</AvatarFallback>
            </Avatar>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Solvex</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.replace(ROUTES.lobby)}
            aria-label="Lobby"
          >
            <Home />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Lobby</TooltipContent>
      </Tooltip>

      <div className={s.spacer} />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
            <LogOut />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Logout</TooltipContent>
      </Tooltip>
    </div>
  );
};
