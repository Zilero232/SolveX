'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button, GoogleIcon } from '@/shared/ui';
import { GoogleSignInCancelled } from '../model/errors';
import { useSignInWithGoogle } from '../model/use-sign-in-with-google';
import { signInWithGoogleButtonStyles as s } from './SignInWithGoogleButton.styles';

export const SignInWithGoogleButton = () => {
  const t = useTranslations('auth');
  const { isPending, mutate } = useSignInWithGoogle();

  const handleClick = () => {
    mutate(undefined, {
      onSuccess: () => toast.success(t('signedIn')),
      onError: (err: Error) => {
        // Closing the popup is a user choice, not a failure.
        if (err instanceof GoogleSignInCancelled) return;

        toast.error(err.message);
      },
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
