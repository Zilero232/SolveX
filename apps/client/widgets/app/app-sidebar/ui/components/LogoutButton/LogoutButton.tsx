'use client';

import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { supabase } from '@/shared/api';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';

export const LogoutButton = () => {
  const t = useTranslations('appSidebar');

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);

      return;
    }

    toast.success(t('signedOut'));
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button aria-label={t('logout')} size="icon" variant="ghost" onClick={handleLogout}>
          <LogOut />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{t('logout')}</TooltipContent>
    </Tooltip>
  );
};
