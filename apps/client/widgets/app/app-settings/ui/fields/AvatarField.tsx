'use client';

import { useFileDialog } from '@siberiacancode/reactuse';
import { Camera } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { UserAvatar } from '@/entities/auth/user';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';

type AvatarFieldProps = {
  name: string;
  src: string | null;
  onPick: (file: File) => void;
  onRemove: () => void;
};

export const AvatarField = ({ name, src, onPick, onRemove }: AvatarFieldProps) => {
  const t = useTranslations('settings.profile');

  const { open } = useFileDialog(
    (files) => {
      const file = files?.[0];

      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.error(t('avatarInvalidType'));

        return;
      }

      onPick(file);
    },
    { accept: 'image/*', multiple: false, reset: true },
  );

  return (
    <div className={s.profileAvatarRow}>
      <button
        aria-label={t('avatarLabel')}
        className={s.profileAvatarButton}
        type="button"
        onClick={() => open()}
      >
        <UserAvatar className={s.profileAvatar} colorize name={name} size="lg" src={src} />

        <span className={s.profileAvatarOverlay}>
          <Camera className={s.profileAvatarOverlayIcon} />
        </span>
      </button>

      <div className={s.profileAvatarMeta}>
        <span className={s.profileLabel}>{t('avatarLabel')}</span>
        <span className={s.profileHint}>{t('avatarHint')}</span>
        {src && (
          <button className={s.profileAvatarRemove} type="button" onClick={onRemove}>
            {t('avatarRemove')}
          </button>
        )}
      </div>
    </div>
  );
};
