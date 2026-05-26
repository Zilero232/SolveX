'use client';

import { useTranslations } from 'next-intl';
import { formatBytes } from '@/shared/lib/format-bytes';
import { platformCardStyles as s } from './PlatformCard.styles';
import type { PlatformCardProps } from './PlatformCard.types';

export const PlatformCard = ({ label, Icon, asset }: PlatformCardProps) => {
  const t = useTranslations('downloadApp');

  if (!asset) {
    return (
      <div className={s.root({ state: 'unavailable' })}>
        <Icon className={s.icon} />
        <span className={s.name}>{label}</span>
        <span className={s.unavailable}>{t('notAvailable')}</span>
      </div>
    );
  }

  return (
    <a
      className={s.root({ state: 'available' })}
      download
      href={asset.downloadUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Icon className={s.icon} />
      <span className={s.name}>{label}</span>
      <span className={s.size}>{formatBytes(asset.sizeBytes)}</span>
    </a>
  );
};
