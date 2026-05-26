import { cva } from 'class-variance-authority';

export const shortcutRowStyles = {
  root: 'flex items-center justify-between gap-4 py-2',
  label: 'font-medium text-sm',
  controls: 'flex items-center gap-2',
  warnIcon: 'size-3.5 shrink-0 text-amber-400',
  tooltip:
    'max-w-50 text-wrap border border-amber-500/40 bg-popover text-center text-amber-200 leading-snug [&>span:last-child]:bg-popover [&>span:last-child]:fill-popover',
} as const;

export const shortcutButton = cva('w-55 justify-center gap-2 font-mono text-xs', {
  variants: {
    conflict: {
      true: 'border-amber-500/40 bg-amber-500/6 text-amber-200 hover:bg-amber-500/10',
      false: '',
    },
  },
  defaultVariants: { conflict: false },
});
