import { format, isToday, isYesterday } from 'date-fns';

/** Smart timestamp: time today, "yesterday, HH:mm", otherwise "d MMM, HH:mm". */
export const formatMessageTime = (timestamp: Date | number) => {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  if (isToday(date)) return format(date, 'HH:mm');
  if (isYesterday(date)) return `yesterday, ${format(date, 'HH:mm')}`;
  return format(date, 'd MMM, HH:mm');
};
