'use client';

import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/constants';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';

export const LobbyButton = () => {
  const router = useRouter();

  return (
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
  );
};
