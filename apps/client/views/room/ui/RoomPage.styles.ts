export const roomPageStyles = {
  loaderRoot: 'flex h-full items-center justify-center',
  loaderBox: 'flex flex-col items-center gap-2',
  loaderIcon: 'size-5 animate-spin text-muted-foreground',
  loaderText: 'text-muted-foreground text-sm',
  preJoinRoot: 'h-full p-4',
  preJoinFrame: 'mx-auto h-full max-w-3xl overflow-hidden rounded-lg border',
  voiceRoot: 'h-full p-4',
  voiceFrame: 'flex h-full flex-col overflow-hidden rounded-lg border',
} as const;
