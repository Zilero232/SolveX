export const authPageStyles = {
  root: 'flex h-full items-center justify-center p-4',
  card: 'w-full max-w-md rounded-xl border bg-card p-8 shadow-lg',
  header: 'mb-6 flex flex-col gap-1',
  title: 'font-semibold text-2xl',
  subtitle: 'text-muted-foreground text-sm',
  toggle: 'mt-4 text-center text-muted-foreground text-sm',
  toggleButton: 'font-medium text-foreground hover:underline',
  divider: 'my-5 flex items-center gap-3',
  dividerLine: 'h-px flex-1 bg-border',
  dividerText: 'text-muted-foreground text-xs uppercase',
} as const;
