export const emojiPickerStyles = {
  root: 'flex h-80 w-72 flex-col bg-transparent text-foreground',
  search:
    'mx-2 mt-2 mb-1 h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-hidden transition-colors placeholder:text-muted-foreground focus-visible:border-white/20 focus-visible:ring-2 focus-visible:ring-brand-cyan',
  viewport: 'relative flex-1 outline-hidden',
  list: 'select-none pb-1.5',
  categoryHeader:
    'bg-background/80 px-2.5 py-1 font-medium text-muted-foreground text-xs backdrop-blur-md',
  row: 'scroll-my-1 px-1.5',
  emoji:
    'flex size-9 items-center justify-center rounded-lg text-xl transition-transform data-[active=true]:scale-110 data-[active=true]:bg-white/10',
  state: 'absolute inset-0 flex items-center justify-center text-muted-foreground text-sm',
} as const;
