export const titleBarControlsStyles = {
  root: 'flex h-full items-stretch',
  button:
    'inline-flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:outline-none',
  closeButton:
    'inline-flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-destructive hover:text-white focus-visible:bg-destructive focus-visible:text-white focus-visible:outline-none',
  icon: 'size-3.5',
} as const;
