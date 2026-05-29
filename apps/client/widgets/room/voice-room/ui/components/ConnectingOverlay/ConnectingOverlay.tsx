'use client';

import { useConnectionState } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';
import { connectingOverlayStyles as s } from './ConnectingOverlay.styles';

type ConnectingOverlayProps = {
  roomName: string;
};

export const ConnectingOverlay = ({ roomName }: ConnectingOverlayProps) => {
  const t = useTranslations('room');
  const state = useConnectionState();

  const text = match(state)
    .with(ConnectionState.Connected, ConnectionState.Disconnected, () => null)
    .with(ConnectionState.Reconnecting, ConnectionState.SignalReconnecting, () =>
      t('reconnecting', { name: roomName }),
    )
    .with(ConnectionState.Connecting, () => t('connecting', { name: roomName }))
    .exhaustive();

  if (text === null) return null;

  return (
    <div className={s.root}>
      <div className={s.box}>
        <Loader2 className={s.icon} />
        <p className={s.text}>{text}</p>
      </div>
    </div>
  );
};
