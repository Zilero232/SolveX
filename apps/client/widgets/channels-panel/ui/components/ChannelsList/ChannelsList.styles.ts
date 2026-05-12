import { cva } from 'class-variance-authority';

export const channelsListStyles = {
  scroll: 'flex-1',
  list: 'flex flex-col gap-0.5 p-2',
  sectionLabel: 'px-2 py-1 text-muted-foreground text-xs uppercase tracking-wide',
  sectionLabelOffset: 'mt-3',
  lobbyTrigger: cva('flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors', {
    variants: {
      active: {
        true: 'bg-sidebar-accent text-sidebar-accent-foreground',
        false:
          'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
      },
    },
    defaultVariants: { active: false },
  }),
  lobbyIcon: 'size-3.5',
  loaderIcon: 'mx-auto my-2 size-4 animate-spin text-muted-foreground',
  emptyHint: 'px-2 py-1 text-muted-foreground text-xs italic',
} as const;
