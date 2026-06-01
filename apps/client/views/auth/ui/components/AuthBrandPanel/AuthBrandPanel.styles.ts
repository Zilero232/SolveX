export const authBrandPanelStyles = {
  root: 'relative hidden flex-col overflow-hidden bg-linear-to-br from-brand-violet/18 via-transparent to-brand-cyan/12 p-10 lg:flex',
  orb: 'auth-orb -left-10 top-1/3 size-64',

  top: 'relative flex items-center gap-3',
  center: 'relative flex flex-1 flex-col justify-center gap-8 py-10',
  mark: 'flex size-11 items-center justify-center rounded-2xl gradient-brand text-background shadow-glow-cyan',
  wordmark: 'font-bold text-xl tracking-tight gradient-text',
  tagline: 'max-w-xs font-semibold text-2xl/snug tracking-tight text-foreground',

  features: 'flex flex-col gap-4',
  feature:
    'flex items-start gap-3.5 animate-in fade-in slide-in-from-left-4 fill-mode-both duration-500',
  featureIcon:
    'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-white/5 text-brand-cyan',
  featureBody: 'flex flex-col gap-0.5',
  featureTitle: 'font-semibold text-sm text-foreground',
  featureDesc: 'text-muted-foreground text-xs/relaxed',

  equalizer: 'relative flex h-6 items-end gap-1',
  eqBar: 'w-1 rounded-full bg-linear-to-t from-brand-cyan to-brand-violet animate-pulse',
} as const;
