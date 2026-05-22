export const lobbyHeaderStyles = {
  root: 'flex flex-wrap items-center justify-between gap-4',
  text: 'flex flex-col gap-1',
  title: 'font-semibold text-2xl',
  subtitle: 'text-muted-foreground text-sm',

  // Live clock pinned to the right edge.
  clock: 'flex flex-col items-end leading-tight',
  time: 'font-semibold text-2xl tabular-nums',
  date: 'text-muted-foreground text-xs',
} as const;
