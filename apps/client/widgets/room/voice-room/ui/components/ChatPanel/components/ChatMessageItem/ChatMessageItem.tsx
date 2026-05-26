import { UserAvatar, UserName } from '@/entities/auth/user';
import { readParticipantMeta } from '@/entities/room/room';
import { formatMessageTime } from '@/shared/lib/format-date';
import { chatMessageItemStyles as s } from './ChatMessageItem.styles';
import type { ChatMessageItemProps } from './ChatMessageItem.types';

export const ChatMessageItem = ({ message, isOwn, isGrouped }: ChatMessageItemProps) => {
  const author = message.from?.name || message.from?.identity || 'Guest';
  const { profileUrl, verified, avatarUrl } = readParticipantMeta(message.from?.metadata);
  const showHeader = !isGrouped;

  return (
    <div className={s.root} data-own={isOwn}>
      {!isOwn &&
        (isGrouped ? (
          <span aria-hidden className={s.spacer} />
        ) : (
          <UserAvatar
            name={author}
            src={avatarUrl}
            size="sm"
            colorize
            className={s.avatar}
            fallbackClassName={s.avatarFallback}
          />
        ))}

      <div className={s.column} data-own={isOwn}>
        {showHeader && (
          <div className={s.meta}>
            {!isOwn && (
              <UserName
                name={author}
                verified={verified}
                profileUrl={profileUrl}
                className={s.author}
              />
            )}
            <span className={s.time}>{formatMessageTime(message.timestamp)}</span>
          </div>
        )}
        <div className={s.bubble({ own: isOwn })}>{message.message}</div>
      </div>
    </div>
  );
};
