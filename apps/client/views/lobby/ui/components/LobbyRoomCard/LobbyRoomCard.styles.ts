import { cva } from 'class-variance-authority';

export const lobbyRoomCardStyles = {
  // Outer wrapper is `relative` so the manage menu can float over the card's
  // top-right corner without sitting inside the navigate button (button-in-button
  // is invalid HTML and breaks Radix focus management).
  root: 'group/card glass glass-hover relative flex h-full min-h-[140px] flex-col overflow-hidden rounded-2xl hover:border-brand-violet/40 hover:shadow-glow-violet',

  enter: cva(
    'flex h-full w-full flex-col gap-3 rounded-2xl p-5 pr-12 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/50',
  ),

  header: 'flex items-center justify-between gap-2',
  headerBadges: 'flex shrink-0 items-center gap-1.5',
  name: 'flex min-w-0 items-center gap-1.5 truncate font-semibold text-base',
  privateIcon: 'size-3.5 shrink-0 text-muted-foreground',

  body: 'mt-auto flex min-h-[1.5rem] items-center gap-2',

  participants: 'flex items-center gap-2',
  avatars: 'flex items-center -space-x-2',
  avatar: 'size-7 ring-2 ring-[var(--surface-1)]',
  avatarFallback: 'text-[10px]',
  countLabel: 'text-muted-foreground text-xs',

  emptyHint: 'text-muted-foreground text-xs',

  menu: 'absolute top-3 right-3 opacity-0 transition-opacity group-hover/card:opacity-100 focus-within:opacity-100 data-[state=open]:opacity-100',
} as const;
