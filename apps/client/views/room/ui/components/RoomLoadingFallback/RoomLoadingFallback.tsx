import { Loader2 } from 'lucide-react';
import { roomLoadingFallbackStyles as s } from './RoomLoadingFallback.styles';

export const RoomLoadingFallback = () => (
  <div className={s.root}>
    <div className={s.box}>
      <Loader2 className={s.icon} />
      <p className={s.text}>Loading room...</p>
    </div>
  </div>
);
