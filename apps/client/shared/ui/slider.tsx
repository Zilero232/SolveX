'use client';

import { Slider as SliderPrimitive } from 'radix-ui';
import { cn } from '@/shared/lib/cn';
import type * as React from 'react';

const Slider = ({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) => (
  <SliderPrimitive.Root
    className={cn(
      'relative flex w-full touch-none items-center select-none data-disabled:opacity-50',
      className,
    )}
    data-slot="slider"
    {...props}
  >
    <SliderPrimitive.Track
      className="relative h-1.5 grow overflow-hidden rounded-full bg-muted"
      data-slot="slider-track"
    >
      <SliderPrimitive.Range className="absolute h-full bg-primary" data-slot="slider-range" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block size-3.5 shrink-0 rounded-full border border-primary bg-background shadow-sm transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none"
      data-slot="slider-thumb"
    />
  </SliderPrimitive.Root>
);

export { Slider };
