export const downloadAppDialogStyles = {
  description: 'text-muted-foreground text-sm',
  grid: 'grid grid-cols-1 gap-3 sm:grid-cols-3',
  fallback: 'rounded-md border bg-muted/30 p-4 text-center text-muted-foreground text-sm',
  fallbackLink: 'font-medium text-primary underline-offset-4 hover:underline',
  meta: 'flex items-center justify-between text-muted-foreground text-xs',
  metaLink: 'inline-flex items-center gap-1 hover:text-foreground',
  metaLinkIcon: 'size-3',
  spinner: 'mx-auto size-6 animate-spin text-muted-foreground',
} as const;
