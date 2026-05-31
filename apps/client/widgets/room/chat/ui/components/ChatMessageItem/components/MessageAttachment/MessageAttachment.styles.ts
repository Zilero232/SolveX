import { cva } from 'class-variance-authority';

export const messageAttachmentStyles = {
  image: 'block max-h-72 max-w-full rounded-lg object-cover transition-opacity hover:opacity-90',
  fileName: 'truncate text-sm font-medium',
  fileSize: 'text-xs text-current/70',
  fileMeta: 'flex min-w-0 flex-col',
} as const;

export const fileCard = cva(
  'flex max-w-full items-center gap-2.5 rounded-lg px-3 py-2 transition-colors',
  {
    variants: {
      own: {
        true: 'bg-white/15 hover:bg-white/25',
        false: 'bg-white/8 hover:bg-white/12',
      },
    },
    defaultVariants: { own: false },
  },
);
