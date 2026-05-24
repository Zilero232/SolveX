'use client';

import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { cn } from '@/shared/lib/cn';
import type * as React from 'react';

const RadioGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) => (
  <RadioGroupPrimitive.Root
    className={cn('grid gap-2', className)}
    data-slot="radio-group"
    {...props}
  />
);

const RadioGroupItem = ({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) => (
  <RadioGroupPrimitive.Item
    className={cn(
      'aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary',
      className,
    )}
    data-slot="radio-group-item"
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span className="size-2 rounded-full bg-primary" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
);

export { RadioGroup, RadioGroupItem };
