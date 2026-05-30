export const channelsFooterStyles = {
  root: 'flex items-center gap-2 border-t border-white/8 bg-white/4 px-3 py-2.5',
  avatar: 'size-8',
  fallback: 'text-xs',
  info: 'flex min-w-0 flex-1 flex-col overflow-hidden',
  name: 'truncate font-semibold text-xs',
  status: 'flex items-center gap-1.5 text-[10px] text-brand-cyan',
  dot: 'relative flex size-1.5 shrink-0',
  dotPing: 'absolute inline-flex size-full animate-ping rounded-full bg-brand-cyan opacity-75',
  dotCore:
    'relative inline-flex size-1.5 rounded-full bg-brand-cyan shadow-[0_0_6px_oklch(0.82_0.16_200/0.7)]',
} as const;
