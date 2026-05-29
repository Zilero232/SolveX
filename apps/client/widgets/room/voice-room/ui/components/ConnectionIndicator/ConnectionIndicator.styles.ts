export const connectionIndicatorStyles = {
  root: 'flex items-center gap-1.5',

  bars: 'flex items-end gap-0.5',
  bar: 'w-1 rounded-[1px] transition-colors',
  barActive: {
    good: 'bg-brand-cyan shadow-[0_0_6px_oklch(0.82_0.16_200/0.6)]',
    fair: 'bg-amber-400 shadow-[0_0_6px_oklch(0.85_0.18_85/0.6)]',
    poor: 'bg-destructive shadow-[0_0_6px_oklch(0.7_0.22_22/0.6)]',
  },
  barInactive: 'bg-white/15',

  ping: 'tabular-nums text-muted-foreground text-xs',
} as const;
