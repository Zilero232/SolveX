export const deviceMenuStyles = {
  trigger:
    'absolute -bottom-1 left-1/2 flex h-4 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-background text-muted-foreground outline-hidden transition-colors hover:bg-white/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:opacity-40 data-[state=open]:bg-white/10 data-[state=open]:text-foreground [&[data-state=open]_svg]:rotate-180',
  triggerIcon: 'size-3 transition-transform',
  menu: 'w-72 p-1.5',
  header: 'flex items-center gap-2 px-1.5 pt-1 pb-2 text-muted-foreground',
  headerIcon: 'size-3.5 shrink-0',
  headerLabel: 'truncate text-xs font-medium tracking-wide uppercase',
  list: 'max-h-64 space-y-0.5 overflow-y-auto',
  item: 'gap-2.5 py-2 pr-2 pl-2 [&>span:first-child]:hidden',
  itemActive:
    'border border-brand-cyan/40 bg-brand-cyan/12 text-foreground shadow-[0_0_16px_-6px_oklch(0.82_0.16_200/0.8)] focus:bg-brand-cyan/18',
  itemInactive: 'border border-transparent',
  itemIconBox:
    'flex size-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 [&_svg]:size-3.5',
  itemIconBoxActive: 'border-brand-cyan/30 bg-brand-cyan/15 text-brand-cyan',
  itemLabel: 'min-w-0 flex-1 truncate text-sm',
  itemCheck: 'ml-auto size-4 shrink-0 text-brand-cyan',
} as const;
