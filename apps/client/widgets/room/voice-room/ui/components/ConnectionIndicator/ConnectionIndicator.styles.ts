export const connectionIndicatorStyles = {
  root: 'flex items-center gap-1.5',

  bars: 'flex items-end gap-0.5',
  // Each bar grows taller; index 0 is the shortest. Heights via inline style.
  bar: 'w-1 rounded-[1px] transition-colors',
  barActive: {
    good: 'bg-emerald-500',
    fair: 'bg-amber-500',
    poor: 'bg-red-500',
  },
  barInactive: 'bg-muted-foreground/25',

  ping: 'tabular-nums text-muted-foreground text-xs',
} as const;
