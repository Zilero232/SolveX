'use client';

import { Mic, MicOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui';
import { useMicTest } from '../../model/hooks';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import type { AudioSettings } from '../../model/types';

type MicTestProps = {
  deviceId: string;
  audio: AudioSettings;
};

export const MicTest = ({ deviceId, audio }: MicTestProps) => {
  const t = useTranslations('settings.audio');
  const { level, isLoopback, toggleLoopback, error } = useMicTest({ deviceId, audio });

  return (
    <div className={s.micTest}>
      <div className={s.micTestBar}>
        <div className={s.micTestFill} style={{ width: `${Math.round(level * 100)}%` }} />
      </div>

      <Button
        aria-label={isLoopback ? t('stopTestMic') : t('testMic')}
        aria-pressed={isLoopback}
        disabled={error}
        size="icon"
        type="button"
        variant={isLoopback ? 'secondary' : 'ghost'}
        onClick={toggleLoopback}
      >
        {isLoopback ? <Mic /> : <MicOff />}
      </Button>
    </div>
  );
};
