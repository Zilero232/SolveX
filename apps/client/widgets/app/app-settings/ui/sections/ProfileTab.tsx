'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFieldError } from '@/entities/app/locale';
import {
  type ProfileValues,
  profileSchema,
  useCurrentUser,
  useUpdateProfile,
} from '@/entities/auth/user';
import { Button, Input, Label, Textarea } from '@/shared/ui';
import { useAvatarDraft } from '../../model/hooks';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { AvatarField } from '../fields/AvatarField';
import { BannerColorField } from '../fields/BannerColorField';

export const ProfileTab = () => {
  const t = useTranslations('settings.profile');
  const fieldError = useFieldError('auth');

  const { displayName, profileUrl, avatarUrl, bannerColor, bio } = useCurrentUser();

  const { isPending, mutate } = useUpdateProfile();

  const avatar = useAvatarDraft(avatarUrl);

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: displayName, profileUrl: profileUrl ?? '', bannerColor, bio: bio ?? '' },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(
      { ...values, avatar: avatar.value },
      {
        onSuccess: () => {
          toast.success(t('saved'));
          reset(values);
          avatar.reset();
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  });

  const canSave = (isDirty || avatar.changed) && !isPending;

  return (
    <div className={s.profilePanel}>
      <form className={s.profileForm} onSubmit={onSubmit}>
        <AvatarField
          name={displayName}
          src={avatar.shownSrc}
          onPick={avatar.pick}
          onRemove={avatar.remove}
        />

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

        <div className={s.profileField}>
          <Label className={s.profileLabel} htmlFor="profile-bio">
            {t('bioLabel')}
          </Label>

          <Textarea
            id="profile-bio"
            placeholder={t('bioPlaceholder')}
            rows={3}
            {...register('bio')}
          />

          {errors.bio ? (
            <p className={s.profileError}>{fieldError(errors.bio)}</p>
          ) : (
            <p className={s.profileHint}>{t('bioHint')}</p>
          )}
        </div>

        <Controller
          control={control}
          name="bannerColor"
          render={({ field }) => <BannerColorField value={field.value} onChange={field.onChange} />}
        />

        <Button className={s.profileSubmit} disabled={!canSave} type="submit">
          {isPending && <Loader2 className={s.profileSpinner} />}
          {t('save')}
        </Button>
      </form>

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
