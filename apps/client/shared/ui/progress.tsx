import { Progress as ProgressPrimitive } from 'radix-ui';
import { cn } from '@/shared/lib/cn';
import type * as React from 'react';

const Progress = ({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) => (
  <ProgressPrimitive.Root
    className={cn('relative h-2 w-full overflow-hidden rounded-full bg-muted', className)}
    data-slot="progress"
    value={value}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-transform duration-300 ease-out"
      data-slot="progress-indicator"
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
);

export { Progress };
