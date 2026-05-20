import { MessageSquare } from 'lucide-react';

import { chatEmptyStyles as s } from './ChatEmpty.styles';

export const ChatEmpty = () => (
  <div className={s.root}>
    <MessageSquare className={s.icon} />
    <p className={s.title}>It's quiet here</p>
    <p className={s.hint}>Be the first to send a message in this room.</p>
  </div>
);
