'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Download } from 'lucide-react';
import { DownloadAppDialog } from '@/features/download-app';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';

export const DownloadAppButton = () => {
  const [isOpen, toggle] = useBoolean(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="Download desktop app"
            size="icon"
            variant="ghost"
            onClick={() => toggle(true)}
          >
            <Download />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Download app</TooltipContent>
      </Tooltip>

      <DownloadAppDialog open={isOpen} onOpenChange={toggle} />
    </>
  );
};
