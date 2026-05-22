export const lobbyRoomCardStyles = {
  root: 'flex flex-col gap-3 rounded-lg border bg-card p-4 text-left transition-colors hover:border-primary/50 hover:bg-accent/40',

  header: 'flex items-center justify-between gap-2',
  name: 'flex min-w-0 items-center gap-1.5 truncate font-semibold text-sm',
  privateIcon: 'size-3.5 shrink-0 text-muted-foreground',

  // Live badge: pulsing dot + label when the room has participants.
  liveBadge:
    'flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs',
  liveDot: 'size-1.5 animate-pulse rounded-full bg-primary',
  idleBadge:
    'shrink-0 rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs',

  participants: 'flex items-center gap-2',
  avatars: 'flex items-center -space-x-2',
  avatar: 'size-7 ring-2 ring-card',
  avatarFallback: 'bg-primary text-[10px] text-primary-foreground',
  overflow:
    'flex size-7 items-center justify-center rounded-full bg-muted text-[10px] text-muted-foreground ring-2 ring-card',
  countLabel: 'text-muted-foreground text-xs',

  emptyHint: 'text-muted-foreground text-xs',
} as const;
