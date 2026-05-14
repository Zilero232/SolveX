export const roomPageStyles = {
  loaderRoot: 'flex h-full items-center justify-center',
  loaderBox: 'flex w-full max-w-xs flex-col items-center gap-3',
  loaderIcon: 'size-5 animate-spin text-muted-foreground',
  loaderText: 'text-muted-foreground text-sm',
  field: 'flex w-full flex-col gap-1.5',
  error: 'text-destructive text-xs',
  spinner: 'mr-2 size-4 animate-spin',
  preJoinRoot: 'h-full p-4',
  preJoinFrame: 'mx-auto h-full max-w-3xl overflow-hidden rounded-lg border',
  voiceRoot: 'h-full p-4',
  voiceFrame: 'flex h-full flex-col overflow-hidden rounded-lg border',
} as const;
