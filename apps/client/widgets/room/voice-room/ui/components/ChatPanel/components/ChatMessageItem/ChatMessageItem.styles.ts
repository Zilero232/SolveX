import { cva } from 'class-variance-authority';

export const chatMessageItemStyles = {
  root: 'flex items-end gap-2 data-[own=true]:flex-row-reverse',
  avatar: 'size-7 shrink-0',
  avatarFallback: 'text-[10px] text-white',
  spacer: 'size-7 shrink-0',
  column: 'flex min-w-0 max-w-[85%] flex-col gap-1 data-[own=true]:items-end',
  meta: 'flex items-center gap-2 px-1 text-[11px] text-muted-foreground',
  author: 'font-medium text-foreground/80',
  time: 'tabular-nums',
  bubble: cva('whitespace-pre-wrap break-words rounded-2xl px-3 py-1.5 text-sm', {
    variants: {
      own: {
        true: 'rounded-br-md bg-primary text-primary-foreground',
        false: 'rounded-bl-md bg-sidebar-accent text-sidebar-accent-foreground',
      },
    },
    defaultVariants: { own: false },
  }),
} as const;
