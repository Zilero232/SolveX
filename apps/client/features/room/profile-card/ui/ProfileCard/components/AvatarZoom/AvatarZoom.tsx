'use client';

import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/shared/ui';
import { avatarZoomStyles as s } from './AvatarZoom.styles';
import type { AvatarZoomProps } from './AvatarZoom.types';

export const AvatarZoom = ({ src, name, children }: AvatarZoomProps) => {
  const t = useTranslations('profileCard');

  if (!src) return <>{children}</>;

  return (
    <Dialog>
      <DialogTrigger className={s.trigger} type="button">
        {children}
      </DialogTrigger>
      <DialogContent className={s.content} showCloseButton={false}>
        <DialogTitle className="sr-only">{t('avatarAlt', { name })}</DialogTitle>
        {/* biome-ignore lint/performance/noImgElement: static export (images.unoptimized) — next/image adds no value for a one-off lightbox of a remote URL */}
        <img alt={t('avatarAlt', { name })} className={s.image} src={src} />
      </DialogContent>
    </Dialog>
  );
};
