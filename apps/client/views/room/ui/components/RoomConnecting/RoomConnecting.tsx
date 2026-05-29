'use client';

import { useTranslations } from 'next-intl';
import { CenteredState, Spinner } from '@/shared/ui';

export const RoomConnecting = () => {
  const t = useTranslations('room');

  return <CenteredState icon={<Spinner size="sm" />} size="sm" title={t('authorizing')} />;
};
