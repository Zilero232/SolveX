'use client';

import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/shared/ui';
import { type AudioSettings, useMicTest } from '../../model';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';

type MicTestProps = {
  deviceId: string;
  audio: AudioSettings;
};

export const MicTest = ({ deviceId, audio }: MicTestProps) => {
  const { level, isLoopback, toggleLoopback, error } = useMicTest({ deviceId, audio });

  return (
    <div className={s.micTest}>
      <div className={s.micTestBar}>
        {/* The fill width tracks the live mic level, 0..100%. */}
        <div className={s.micTestFill} style={{ width: `${Math.round(level * 100)}%` }} />
      </div>

      <Button
        aria-label={isLoopback ? 'Stop microphone test' : 'Test microphone'}
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
