export const lobbyHeaderStyles = {
  root: 'relative isolate overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-brand-violet/12 via-white/3 to-brand-cyan/12 p-6 sm:p-10',

  glow: 'pointer-events-none absolute -top-32 -right-24 size-72 rounded-full bg-brand-violet/30 blur-[100px]',
  glowAlt:
    'pointer-events-none absolute -bottom-32 -left-24 size-72 rounded-full bg-brand-cyan/25 blur-[100px]',

  inner: 'relative flex flex-col gap-6 sm:gap-8',

  topRow: 'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6',
  text: 'flex min-w-0 flex-col gap-1.5',
  title: 'font-bold text-2xl text-foreground sm:text-3xl tracking-tight',
  subtitle: 'text-muted-foreground text-sm sm:text-base',

  versionPill:
    'group relative inline-flex shrink-0 items-center gap-2 self-start overflow-hidden rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 backdrop-blur-md transition-all hover:border-brand-cyan/45 hover:bg-white/8 hover:shadow-[0_0_0_3px_oklch(0.82_0.16_200/0.08)] sm:self-auto',
  versionIcon:
    'size-3.5 text-brand-cyan drop-shadow-[0_0_8px_oklch(0.82_0.16_200/0.8)] transition-transform group-hover:rotate-12',
  versionText:
    'bg-linear-to-r from-brand-cyan to-brand-violet bg-clip-text font-semibold text-transparent text-xs tabular-nums tracking-[0.04em]',

  stats: 'flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3',
  stat: 'flex items-center gap-2.5',
  statIcon: 'size-4 text-brand-cyan',
  statIconLive: 'size-4 text-brand-cyan drop-shadow-[0_0_6px_oklch(0.82_0.16_200/0.7)]',
  statIconMuted: 'size-4 text-muted-foreground',
  statPulse:
    'inline-block size-2 animate-pulse rounded-full bg-brand-violet shadow-[0_0_10px_oklch(0.7_0.2_270/0.8)]',
  statValue: 'font-bold text-foreground text-lg tabular-nums sm:text-xl',
  statLabel: 'text-muted-foreground text-xs uppercase tracking-[0.12em]',
  statDivider: 'hidden h-6 w-px bg-white/12 sm:block',
} as const;
