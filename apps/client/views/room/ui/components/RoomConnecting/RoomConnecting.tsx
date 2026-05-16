import { Loader2 } from 'lucide-react';
import { roomConnectingStyles as s } from './RoomConnecting.styles';
import type { RoomConnectingProps } from './RoomConnecting.types';

export const RoomConnecting = ({ displayName }: RoomConnectingProps) => (
  <div className={s.root}>
    <div className={s.box}>
      <Loader2 className={s.icon} />
      <p className={s.text}>Connecting to "{displayName}"...</p>
    </div>
  </div>
);
