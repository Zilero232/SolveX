export const channelsFooterStyles = {
  root: 'flex items-center gap-2 border-t bg-sidebar-accent/30 px-3 py-2',
  avatar: 'size-7',
  fallback: 'bg-primary text-primary-foreground text-xs',
  info: 'flex flex-col overflow-hidden',
  name: 'truncate font-semibold text-xs',
  status: 'text-[10px] text-muted-foreground',
} as const;
