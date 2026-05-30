import { cva } from 'class-variance-authority';

export const titleBarStyles = {
  root: cva(
    'flex h-8 shrink-0 items-stretch border-border border-b bg-background/80 backdrop-blur',
    {
      variants: {
        platform: {
          macos: 'pl-[78px]',
          windows: '',
          linux: '',
        },
      },
    },
  ),
  dragRegion: 'flex flex-1 items-center',
  navButtons: 'flex items-center gap-0.5 px-2',
  navButton:
    'flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30',
  navIcon: 'size-4',
} as const;
