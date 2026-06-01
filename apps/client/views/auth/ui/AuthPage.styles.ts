export const authPageStyles = {
  root: 'relative flex h-full items-center justify-center overflow-hidden p-4',

  shell:
    'relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] glass shadow-glow-violet lg:grid-cols-[1.05fr_1fr]',

  panel: 'relative flex flex-col justify-center p-7 sm:p-9 lg:p-11',
  mobileMark:
    'mb-5 flex size-12 items-center justify-center self-start rounded-2xl gradient-brand text-background shadow-glow-cyan lg:hidden',
  header: 'mb-6 flex flex-col gap-1.5',
  title: 'font-bold text-3xl tracking-tight gradient-text',
  subtitle: 'text-muted-foreground text-sm',

  form: 'animate-in fade-in duration-300',

  divider: 'my-5 flex items-center gap-3',
  dividerLine: 'h-px flex-1 bg-linear-to-r from-transparent via-white/15 to-transparent',
  dividerText: 'text-muted-foreground text-xs uppercase tracking-[0.14em]',
  toggle: 'mt-5 text-center text-muted-foreground text-sm',
  toggleButton:
    'font-semibold text-brand-cyan transition-colors hover:text-brand-cyan/80 hover:underline',
} as const;
