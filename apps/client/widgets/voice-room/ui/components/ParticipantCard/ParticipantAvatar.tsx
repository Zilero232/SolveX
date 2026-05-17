import { getAvatarColor, getInitials } from '@/shared/lib/initials';

import { participantCardStyles as s } from './ParticipantCard.styles';

interface ParticipantAvatarProps {
  name: string;
}

/** Centered initials circle shown when no camera/screen track is active. */
export const ParticipantAvatar = ({ name }: ParticipantAvatarProps) => (
  <div className={s.avatarSlot}>
    <div className={`${s.avatar} ${getAvatarColor(name)}`}>
      <span className={s.avatarInitials}>{getInitials(name)}</span>
    </div>
  </div>
);
