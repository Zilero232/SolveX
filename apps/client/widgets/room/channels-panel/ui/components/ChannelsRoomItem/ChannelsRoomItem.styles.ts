import { cva } from 'class-variance-authority';

export const channelsRoomItemStyles = {
  trigger: cva(
    'flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
    {
      variants: {
        active: {
          true: 'bg-sidebar-accent text-sidebar-accent-foreground',
          false:
            'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
        },
      },
      defaultVariants: { active: false },
    },
  ),
  triggerLabel: 'flex items-center gap-2',
  privateIcon: 'size-3 text-muted-foreground',
  icon: cva('size-3.5', {
    variants: { active: { true: 'text-green-500', false: '' } },
    defaultVariants: { active: false },
  }),
  joinedBadge: 'rounded border border-green-500/40 px-1.5 py-0.5 text-[9px] text-green-500',
  count: 'flex items-center gap-1 text-muted-foreground text-xs tabular-nums',
  countDot: 'size-1.5 rounded-full bg-green-500',
  participants: 'flex flex-col',
  participant: 'flex items-center gap-2 py-1 pr-2 pl-8',
  participantAvatar: 'size-5',
  participantFallback: 'bg-primary text-[10px] text-primary-foreground',
  participantName: 'truncate text-muted-foreground text-xs',
} as const;
