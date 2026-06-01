'use client';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { Toaster as Sonner } from 'sonner';
import type { ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    icons={{
      success: <CircleCheckIcon className="size-4" />,
      info: <InfoIcon className="size-4" />,
      warning: <TriangleAlertIcon className="size-4" />,
      error: <OctagonXIcon className="size-4" />,
      loading: <Loader2Icon className="size-4 animate-spin" />,
    }}
    style={
      {
        '--normal-bg': 'var(--surface-overlay)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--glass-border)',
        '--border-radius': 'var(--radius)',
      } as React.CSSProperties
    }
    toastOptions={{
      classNames: {
        toast:
          'group/toast relative overflow-hidden backdrop-blur-xl border-border-strong shadow-[0_24px_64px_-16px_oklch(0_0_0/0.55),0_1px_0_oklch(1_0_0/8%)_inset] before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:rounded-full',
        title: 'font-semibold tracking-tight',
        description: 'text-muted-foreground',
        icon: 'flex items-center justify-center',
        success: 'shadow-glow-cyan before:bg-brand-cyan [&_[data-icon]]:text-brand-cyan',
        error: 'shadow-glow-fuchsia before:bg-destructive [&_[data-icon]]:text-destructive',
        warning: 'before:bg-brand-lime [&_[data-icon]]:text-brand-lime',
        info: 'shadow-glow-violet before:bg-brand-violet [&_[data-icon]]:text-brand-violet',
        loading: '[&_[data-icon]]:text-brand-violet',
      },
    }}
    className="toaster group"
    position="top-right"
    theme="dark"
    {...props}
  />
);

export { Toaster };
