'use client';

import {
  useConnectionQualityIndicator,
  useConnectionState,
  useLocalParticipant,
} from '@livekit/components-react';
import { ConnectionQuality, ConnectionState } from 'livekit-client';
import { useTranslations } from 'next-intl';
import { isNonNullish } from 'remeda';
import { match } from 'ts-pattern';
import { cn } from '@/shared/lib';
import { useConnectionRtt } from '../../../model';
import { connectionIndicatorStyles as s } from './ConnectionIndicator.styles';

const BAR_HEIGHTS = [4, 7, 10, 13, 16] as const;

const barsFromRtt = (rtt: number): number => {
  if (rtt < 50) return 5;
  if (rtt < 100) return 4;
  if (rtt < 150) return 3;
  if (rtt < 250) return 2;

  return 1;
};

const barsFromQuality = (quality: ConnectionQuality): number => {
  return match(quality)
    .with(ConnectionQuality.Excellent, () => 5)
    .with(ConnectionQuality.Good, () => 3)
    .with(ConnectionQuality.Poor, () => 1)
    .with(ConnectionQuality.Lost, () => 0)
    .otherwise(() => 0);
};

export const ConnectionIndicator = () => {
  const t = useTranslations('room.connection');

  const { localParticipant } = useLocalParticipant();
  const { quality } = useConnectionQualityIndicator({ participant: localParticipant });
  const connectionState = useConnectionState();
  const rtt = useConnectionRtt();

  if (connectionState !== ConnectionState.Connected) return null;

  const hasRtt = isNonNullish(rtt);
  const bars = hasRtt ? barsFromRtt(rtt) : barsFromQuality(quality);

  const tone = bars >= 4 ? 'good' : bars >= 2 ? 'fair' : 'poor';
  const label = hasRtt ? t('ping', { ms: rtt }) : t('measuring');

  return (
    <div aria-label={label} className={s.root} role="img" title={label}>
      <div className={s.bars}>
        {BAR_HEIGHTS.map((height, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length static list
            key={index}
            className={cn(s.bar, index < bars ? s.barActive[tone] : s.barInactive)}
            style={{ height }}
          />
        ))}
      </div>

      {hasRtt && <span className={s.ping}>{rtt}&nbsp;ms</span>}
    </div>
  );
};
