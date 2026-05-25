'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFieldError } from '@/entities/app/locale';
import {
  type ProfileValues,
  profileSchema,
  useCurrentUser,
  useUpdateProfile,
} from '@/entities/auth/user';
import { Button, Input, Label } from '@/shared/ui';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';

export const ProfileTab = () => {
  const t = useTranslations('settings.profile');
  const fieldError = useFieldError('auth');

  const { displayName, profileUrl } = useCurrentUser();
  const { isPending, mutate } = useUpdateProfile();

  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: displayName, profileUrl: profileUrl ?? '' },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(t('saved'));
        // Re-baseline the form so the fields are no longer "dirty".
        reset(values);
      },
      onError: (err: Error) => toast.error(err.message),
    });
  });

  return (
    <div className={s.profilePanel}>
      <form className={s.profileForm} onSubmit={onSubmit}>
        <div className={s.profileField}>
          <Label className={s.profileLabel} htmlFor="profile-display-name">
            {t('displayNameLabel')}
          </Label>

          <Input autoComplete="name" id="profile-display-name" {...register('name')} />

          {errors.name ? (
            <p className={s.profileError}>{fieldError(errors.name)}</p>
          ) : (
            <p className={s.profileHint}>{t('displayNameHint')}</p>
          )}
        </div>

        <div className={s.profileField}>
          <Label className={s.profileLabel} htmlFor="profile-url">
            {t('profileUrlLabel')}
          </Label>

          <Input
            autoComplete="url"
            id="profile-url"
            placeholder={t('profileUrlPlaceholder')}
            type="url"
            {...register('profileUrl')}
          />

          {errors.profileUrl ? (
            <p className={s.profileError}>{fieldError(errors.profileUrl)}</p>
          ) : (
            <p className={s.profileHint}>{t('profileUrlHint')}</p>
          )}
        </div>

        <Button className={s.profileSubmit} disabled={!isDirty || isPending} type="submit">
          {isPending && <Loader2 className={s.profileSpinner} />}
          {t('save')}
        </Button>
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
