import { Mic, Video, Volume2 } from 'lucide-react';
import { match } from 'ts-pattern';

export const deviceIcon = (kind: MediaDeviceKind) =>
  match(kind)
    .with('audioinput', () => Mic)
    .with('audiooutput', () => Volume2)
    .with('videoinput', () => Video)
    .otherwise(() => Mic);
