export const recentRoomsStyles = {
  root: 'flex flex-col gap-2 border-t border-white/8 pt-3',
  heading:
    'flex items-center gap-1.5 px-2 text-muted-foreground/80 text-[10px] font-semibold uppercase tracking-[0.12em]',
  headingIcon: 'size-3 text-brand-cyan',
  list: 'flex flex-col gap-0.5',
  item: 'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-sidebar-foreground/75 transition-all hover:bg-white/6 hover:text-sidebar-foreground',
  dot: 'size-1.5 shrink-0 rounded-full bg-muted-foreground/40',
  dotLive:
    'size-1.5 shrink-0 animate-pulse rounded-full bg-brand-cyan shadow-[0_0_8px_oklch(0.82_0.16_200/0.8)]',
  name: 'flex-1 truncate text-left',
  lockIcon: 'size-3 shrink-0 text-muted-foreground',
} as const;
