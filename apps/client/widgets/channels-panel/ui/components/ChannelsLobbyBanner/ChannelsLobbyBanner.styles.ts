export const channelsLobbyBannerStyles = {
  // Fills the space the room list would occupy.
  root: 'flex flex-1 flex-col gap-3 overflow-y-auto p-4',

  // --- Create-room card --------------------------------------------------
  card: 'flex flex-col items-center gap-3 rounded-lg border border-dashed p-5 text-center',
  iconBox: 'flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary',
  icon: 'size-6',
  text: 'flex flex-col gap-1',
  title: 'font-semibold text-sm',
  hint: 'text-muted-foreground text-xs',
  cta: 'w-full',

  // --- Live stats --------------------------------------------------------
  stats: 'grid grid-cols-2 gap-2',
  stat: 'flex items-center gap-1.5 rounded-md border bg-card px-3 py-2',
  statIcon: 'size-4 shrink-0 text-muted-foreground',
  statIconLive: 'size-4 shrink-0 text-primary',
  statValue: 'font-semibold text-sm tabular-nums',
  statLabel: 'text-muted-foreground text-xs',

  // --- Quick-join the busiest room --------------------------------------
  quickJoin:
    'flex items-center gap-2 rounded-md border bg-card p-2.5 text-left transition-colors hover:border-primary/50 hover:bg-accent/40',
  quickJoinDot: 'size-2 shrink-0 animate-pulse rounded-full bg-primary',
  quickJoinText: 'flex min-w-0 flex-1 flex-col leading-tight',
  quickJoinLabel: 'text-[10px] text-muted-foreground uppercase tracking-wide',
  quickJoinName: 'truncate font-medium text-sm',
  quickJoinAction: 'shrink-0 font-medium text-primary text-xs',

  // --- Tip ---------------------------------------------------------------
  tip: 'mt-auto flex items-start gap-2 rounded-md bg-muted/50 p-3 text-muted-foreground text-xs',
  tipIcon: 'size-3.5 shrink-0 translate-y-px',
} as const;
