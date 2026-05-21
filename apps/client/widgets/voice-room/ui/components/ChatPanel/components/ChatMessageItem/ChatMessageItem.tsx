import { cn } from '@/shared/lib/cn';
import { formatMessageTime } from '@/shared/lib/format-date';
import { getAvatarColor, getInitials } from '@/shared/lib/initials';
import { Avatar, AvatarFallback } from '@/shared/ui';
import { chatMessageItemStyles as s } from './ChatMessageItem.styles';
import type { ChatMessageItemProps } from './ChatMessageItem.types';

export const ChatMessageItem = ({ message, isOwn, isGrouped }: ChatMessageItemProps) => {
  const author = message.from?.name || message.from?.identity || 'Guest';
  const showHeader = !isGrouped;

  return (
    <div className={s.root} data-own={isOwn}>
      {!isOwn &&
        (isGrouped ? (
          <span aria-hidden className={s.spacer} />
        ) : (
          <Avatar className={s.avatar} size="sm">
            <AvatarFallback className={cn(s.avatarFallback, getAvatarColor(author))}>
              {getInitials(author)}
            </AvatarFallback>
          </Avatar>
        ))}

      <div className={s.column} data-own={isOwn}>
        {showHeader && (
          <div className={s.meta}>
            {!isOwn && <span className={s.author}>{author}</span>}
            <span className={s.time}>{formatMessageTime(message.timestamp)}</span>
          </div>
        )}
        <div className={s.bubble({ own: isOwn })}>{message.message}</div>
      </div>
    </div>
  );
};
