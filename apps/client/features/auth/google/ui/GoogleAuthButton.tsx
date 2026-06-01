'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button, GoogleIcon } from '@/shared/ui';
import { useGoogleAuth } from '../model/hooks';
import { googleAuthButtonStyles as s } from './GoogleAuthButton.styles';

export const GoogleAuthButton = () => {
  const t = useTranslations('auth');
  const { isPending, mutate } = useGoogleAuth();

  const handleClick = () => {
    mutate(undefined, {
      onError: (err: Error) => toast.error(err.message),
    });
  };

  return (
    <Button
      className={s.button}
      disabled={isPending}
      onClick={handleClick}
      type="button"
      variant="outline"
    >
      {isPending ? <Loader2 className={s.spinner} /> : <GoogleIcon className={s.icon} />}
      {t('continueWithGoogle')}
    </Button>
  );
};
