import { cva } from 'class-variance-authority';

export const controlButtonStyles = {
  group: 'relative flex items-center',
} as const;

export const controlButton = cva(
  'flex size-9 shrink-0 items-center justify-center rounded-full border outline-hidden transition-all duration-150 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-40 sm:size-11 [&_svg]:size-4 [&_svg]:shrink-0 sm:[&_svg]:size-5',
  {
    variants: {
      tone: {
        on: 'border-white/10 bg-white/8 text-foreground hover:bg-white/14 focus-visible:ring-brand-cyan',
        off: 'border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 focus-visible:ring-brand-cyan',
        active:
          'border-white/10 bg-brand-cyan/20 text-brand-cyan shadow-[0_0_18px_-4px_oklch(0.82_0.16_200/0.7)] hover:bg-brand-cyan/30 focus-visible:ring-brand-cyan',
        danger:
          'border-white/10 bg-destructive/15 text-destructive hover:bg-destructive/25 focus-visible:ring-brand-cyan',
        leave:
          'border-transparent bg-destructive text-white shadow-[0_4px_14px_-2px_oklch(0.7_0.22_22/0.5)] hover:bg-[oklch(0.66_0.22_22)] hover:shadow-[0_6px_18px_-2px_oklch(0.7_0.22_22/0.7)] focus-visible:ring-destructive active:translate-y-px',
      },
    },
    defaultVariants: {
      tone: 'off',
    },
  },
);
