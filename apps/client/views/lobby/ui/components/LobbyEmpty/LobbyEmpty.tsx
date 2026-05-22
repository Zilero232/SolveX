import { AudioLines } from 'lucide-react';
import { lobbyEmptyStyles as s } from './LobbyEmpty.styles';

// Shown when no rooms exist yet — nudges the user toward the create button.
export const LobbyEmpty = () => (
  <div className={s.root}>
    <div className={s.iconBox}>
      <AudioLines className={s.icon} />
    </div>
    <p className={s.title}>No rooms yet</p>
    <p className={s.text}>Create the first voice room and invite people to join.</p>
  </div>
);
