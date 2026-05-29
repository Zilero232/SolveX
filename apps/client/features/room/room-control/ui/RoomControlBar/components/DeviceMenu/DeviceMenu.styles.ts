export const deviceMenuStyles = {
  trigger:
    'absolute -right-0.5 -bottom-0.5 flex size-4.5 items-center justify-center rounded-full border border-white/10 bg-background text-muted-foreground outline-hidden transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:opacity-40',
  triggerIcon: 'size-3',
  menu: 'max-h-64 w-64 overflow-y-auto',
} as const;
