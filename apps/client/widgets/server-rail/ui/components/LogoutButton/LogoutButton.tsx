'use client';

import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/shared/api';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';

export const LogoutButton = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);

      return;
    }

    toast.success('Signed out');
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button aria-label="Logout" size="icon" variant="ghost" onClick={handleLogout}>
          <LogOut />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">Logout</TooltipContent>
    </Tooltip>
  );
};
