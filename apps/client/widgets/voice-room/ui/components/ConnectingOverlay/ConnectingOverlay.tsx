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

// A full-frame overlay shown until the LiveKit connection is established.
// Having a token only means we *can* connect — the WebSocket handshake still
// has to finish, and until it does the participants grid would otherwise show
// the local card against an unconnected room. Rendered inside LiveKitRoom so
// it can read the live connection state.
export const ConnectingOverlay = ({ roomName }: ConnectingOverlayProps) => {
  const t = useTranslations('room');
  const state = useConnectionState();

  // `null` once connected — the overlay clears and the grid shows through.
  const text = match(state)
    .with(ConnectionState.Connected, () => null)
    .with(ConnectionState.Reconnecting, ConnectionState.SignalReconnecting, () =>
      t('reconnecting', { name: roomName }),
    )
    .with(ConnectionState.Connecting, ConnectionState.Disconnected, () =>
      t('connecting', { name: roomName }),
    )
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
