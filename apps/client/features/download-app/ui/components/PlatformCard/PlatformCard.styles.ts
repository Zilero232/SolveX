import { cva } from 'class-variance-authority';

export const platformCardStyles = {
  root: cva(
    'flex flex-col items-center gap-3 rounded-lg border bg-card p-4 text-center transition-colors',
    {
      variants: {
        state: {
          available: 'hover:border-ring hover:bg-accent',
          unavailable: 'opacity-50',
        },
      },
      defaultVariants: { state: 'available' },
    },
  ),
  icon: 'size-12 text-foreground',
  name: 'font-semibold text-sm',
  size: 'text-muted-foreground text-xs',
  unavailable: 'text-muted-foreground text-xs italic',
} as const;
