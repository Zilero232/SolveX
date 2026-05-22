'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFieldError } from '@/entities/locale';
import {
  type DisplayNameValues,
  displayNameSchema,
  useCurrentUser,
  useUpdateDisplayName,
} from '@/entities/user';
import { Button, Input, Label } from '@/shared/ui';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';

export const ProfileTab = () => {
  const t = useTranslations('settings.profile');
  const fieldError = useFieldError('auth');

  const { displayName } = useCurrentUser();
  const { isPending, mutate } = useUpdateDisplayName();

  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm<DisplayNameValues>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: { name: displayName },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(t('saved'));
        // Re-baseline the form so the field is no longer "dirty".
        reset(values);
      },
      onError: (err: Error) => toast.error(err.message),
    });
  });

  return (
    <div className={s.profilePanel}>
      <form className={s.profileField} onSubmit={onSubmit}>
        <Label className={s.profileLabel} htmlFor="profile-display-name">
          {t('displayNameLabel')}
        </Label>

        <div className={s.profileInputRow}>
          <Input autoComplete="name" id="profile-display-name" {...register('name')} />
          <Button disabled={!isDirty || isPending} type="submit">
            {isPending && <Loader2 className={s.profileSpinner} />}
            {t('save')}
          </Button>
        </div>

        {errors.name ? (
          <p className={s.profileError}>{fieldError(errors.name)}</p>
        ) : (
          <p className={s.profileHint}>{t('displayNameHint')}</p>
        )}
      </form>

      {/* Placeholders for editors shipping later. */}
      <div className={s.profileSoon}>
        <div className={s.profileSoonRow}>
          <span className={s.profileSoonLabel}>{t('emailSoon')}</span>
        </div>
        <div className={s.profileSoonRow}>
          <span className={s.profileSoonLabel}>{t('passwordSoon')}</span>
        </div>
      </div>
    </div>
  );
};
