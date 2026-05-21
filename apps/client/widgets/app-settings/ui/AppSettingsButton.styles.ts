export const appSettingsStyles = {
  content: 'max-h-[min(36rem,calc(100vh-4rem))] gap-4',

  tabsList: 'w-full',
  tabPanel: 'flex flex-col gap-1 pt-1',

  // A labelled control row: text on the left, control on the right.
  row: 'flex items-center justify-between gap-4 py-2',
  rowText: 'flex min-w-0 flex-col gap-0.5',
  rowLabel: 'text-sm font-medium',
  rowHint: 'text-xs text-muted-foreground',

  // A row whose control sits below the label (sliders, device pickers).
  stackedRow: 'flex flex-col gap-2 py-2',

  deviceTrigger:
    'flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm disabled:opacity-50',
  deviceTriggerLabel: 'truncate text-left',
  deviceMenu: 'max-h-64 w-(--radix-dropdown-menu-trigger-width) overflow-y-auto',

  sliderRow: 'flex items-center gap-3',
  sliderValue: 'w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground',
} as const;
