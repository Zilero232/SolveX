import { cva } from 'class-variance-authority';

export const channelsRoomItemStyles = {
  row: 'group/room relative',
  trigger: cva(
    'relative flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm transition-all group-focus-within/room:pr-8 group-hover/room:pr-8 group-has-[[data-state=open]]/room:pr-8',
    {
      variants: {
        active: {
          true: 'bg-linear-to-r from-brand-violet/25 to-brand-cyan/15 text-foreground shadow-[inset_0_0_0_1px_oklch(0.7_0.2_270/0.35)]',
          false: 'text-sidebar-foreground/75 hover:bg-white/6 hover:text-sidebar-foreground',
        },
      },
      defaultVariants: { active: false },
    },
  ),
  triggerLabel: 'flex items-center gap-2',
  privateIcon: 'size-3 text-muted-foreground',
  ownerIcon: 'size-3 fill-amber-300 text-amber-300 drop-shadow-[0_0_4px_oklch(0.85_0.18_85/0.6)]',
  joinedIcon: 'size-3.5 text-brand-cyan drop-shadow-[0_0_6px_oklch(0.82_0.16_200/0.6)]',
  manageSlot:
    'absolute top-1/2 right-1 -translate-y-1/2 opacity-0 transition-opacity group-hover/room:opacity-100 focus-within:opacity-100 data-[state=open]:opacity-100',
  participants: 'mt-2 flex flex-col gap-0.5',
  participant: 'flex items-center gap-2.5 px-2 py-1',
  participantAvatar: 'size-6',
  participantFallback: 'text-[10px]',
  participantName: 'truncate text-muted-foreground text-xs',
} as const;
