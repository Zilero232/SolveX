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
} as const;
