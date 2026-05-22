export const connectingOverlayStyles = {
  // Covers the whole room frame; sits above the participants grid until the
  // LiveKit connection is actually established.
  root: 'absolute inset-0 z-10 flex items-center justify-center bg-card',
  box: 'flex flex-col items-center gap-3',
  icon: 'size-5 animate-spin text-muted-foreground',
  text: 'text-muted-foreground text-sm',
} as const;
