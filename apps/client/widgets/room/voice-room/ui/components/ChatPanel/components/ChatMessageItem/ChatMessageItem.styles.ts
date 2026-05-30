import { cva } from 'class-variance-authority';

export const chatMessageItemStyles = {
  root: 'flex items-end gap-2 data-[own=true]:flex-row-reverse',
  column: 'flex min-w-0 max-w-[85%] flex-col gap-1 data-[own=true]:items-end',
  meta: 'flex items-center gap-2 px-1 text-[11px] text-muted-foreground',
  nameTrigger:
    'rounded outline-hidden hover:underline focus-visible:ring-2 focus-visible:ring-brand-cyan',
  author: 'font-medium text-foreground/80',
  time: 'tabular-nums',
  bubble: cva('whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm shadow-sm', {
    variants: {
      own: {
        true: 'rounded-br-md bg-brand-violet text-white shadow-[0_4px_14px_-4px_oklch(0.7_0.2_270/0.55)]',
        false: 'rounded-bl-md border border-white/10 bg-white/8 text-foreground backdrop-blur-md',
      },
    },
    defaultVariants: { own: false },
  }),
} as const;
