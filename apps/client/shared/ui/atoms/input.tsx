import { cn } from '@/shared/lib/cn';
import type * as React from 'react';

const Input = ({ className, type, ...props }: React.ComponentProps<'input'>) => (
  <input
    className={cn(
      'h-10 w-full min-w-0 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-base sm:text-sm text-foreground shadow-inner shadow-black/20 backdrop-blur-md transition-all outline-none selection:bg-brand-violet/40 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      'focus-visible:border-brand-cyan/60 focus-visible:bg-white/8 focus-visible:ring-2 focus-visible:ring-brand-cyan/25',
      'hover:border-white/20',
      'aria-invalid:border-destructive/60 aria-invalid:ring-2 aria-invalid:ring-destructive/30',
      className,
    )}
    data-slot="input"
    type={type}
    {...props}
  />
);

export { Input };
