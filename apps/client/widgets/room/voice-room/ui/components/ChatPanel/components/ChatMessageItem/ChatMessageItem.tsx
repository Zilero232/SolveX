import { UserAvatar, UserName } from '@/entities/auth/user';
import { readParticipantMeta } from '@/entities/room/room';
import { ProfileCardTrigger } from '@/features/room/profile-card';
import { formatMessageTime } from '@/shared/lib/format-date';
import { chatMessageItemStyles as s } from './ChatMessageItem.styles';
import type { ChatMessageItemProps } from './ChatMessageItem.types';

export const ChatMessageItem = ({ message, isOwn, isGrouped }: ChatMessageItemProps) => {
  const author = message.from?.name || message.from?.identity || 'Guest';
  const identity = message.from?.identity ?? author;
  const { verified, avatarUrl } = readParticipantMeta(message.from?.metadata);
  const showHeader = !isGrouped;

  return (
    <div className={s.root} data-own={isOwn}>
      {!isOwn &&
        (isGrouped ? (
          <span aria-hidden className={s.spacer} />
        ) : (
          <ProfileCardTrigger identity={identity} name={author}>
            <button className={s.avatarTrigger} type="button">
              <UserAvatar
                name={author}
                src={avatarUrl}
                size="sm"
                colorize
                className={s.avatar}
                fallbackClassName={s.avatarFallback}
              />
            </button>
          </ProfileCardTrigger>
        ))}

      <div className={s.column} data-own={isOwn}>
        {showHeader && (
          <div className={s.meta}>
            {!isOwn && (
              <ProfileCardTrigger identity={identity} name={author}>
                <button className={s.nameTrigger} type="button">
                  <UserName name={author} verified={verified} className={s.author} />
                </button>
              </ProfileCardTrigger>
            )}
            <span className={s.time}>{formatMessageTime(message.timestamp)}</span>
          </div>
        )}
        <div className={s.bubble({ own: isOwn })}>{message.message}</div>
      </div>
    </div>
  );
};
