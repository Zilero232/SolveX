import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/shared/ui';
import { chatHeaderStyles as s } from './ChatHeader.styles';
import type { ChatHeaderProps } from './ChatHeader.types';

export const ChatHeader = ({ onClose }: ChatHeaderProps) => (
  <header className={s.root}>
    <div className={s.title}>
      <MessageSquare className={s.icon} />
      <span>Chat</span>
    </div>
    <Button aria-label="Close chat" size="icon-sm" type="button" variant="ghost" onClick={onClose}>
      <X />
    </Button>
  </header>
);
