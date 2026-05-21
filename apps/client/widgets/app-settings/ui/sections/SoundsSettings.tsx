'use client';

import { Slider, Switch } from '@/shared/ui';
import type { AppSettings, SoundCategory } from '../../model';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { SettingRow } from '../components/SettingRow';

type SoundsSettingsProps = {
  settings: AppSettings;
  setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  toggleSound: (category: SoundCategory) => void;
};

const SOUND_ROWS: { category: SoundCategory; label: string; hint: string }[] = [
  { category: 'join', label: 'Join', hint: 'When someone joins the room.' },
  { category: 'leave', label: 'Leave', hint: 'When someone leaves the room.' },
  { category: 'mute', label: 'Mute / unmute', hint: 'When you toggle your microphone.' },
  { category: 'reconnect', label: 'Reconnect', hint: 'When your connection drops and recovers.' },
  { category: 'message', label: 'Chat message', hint: 'A new message while the chat is closed.' },
];

export const SoundsSettings = ({ settings, setSetting, toggleSound }: SoundsSettingsProps) => (
  <div className={s.tabPanel}>
    <SettingRow
      stacked
      control={
        <div className={s.sliderRow}>
          <Slider
            aria-label="Sound effects volume"
            max={1}
            min={0}
            step={0.05}
            value={[settings.soundsVolume]}
            onValueChange={([value]) => setSetting('soundsVolume', value)}
          />
          <span className={s.sliderValue}>{Math.round(settings.soundsVolume * 100)}%</span>
        </div>
      }
      hint="Loudness of all room sound effects."
      label="Sound effects volume"
    />

    {SOUND_ROWS.map(({ category, label, hint }) => (
      <SettingRow
        key={category}
        control={
          <Switch
            checked={settings.sounds[category]}
            onCheckedChange={() => toggleSound(category)}
          />
        }
        hint={hint}
        label={label}
      />
    ))}
  </div>
);
