export const appSettingsStyles = {
  // A flex column capped at viewport height: the header and tab list stay
  // fixed while the active panel scrolls.
  content: 'flex max-h-[calc(100vh-4rem)] flex-col gap-4',

  // Fills the space left by the header and owns the inner scroll.
  tabs: 'flex min-h-0 flex-1 flex-col',
  tabsList: 'w-full',

  // The scrollable panel; -mr/pr keeps the scrollbar off the content edge.
  tabPanel: '-mr-2 flex max-h-[24rem] flex-col gap-1 overflow-y-auto pr-2 pt-1',

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

  // Mic test: a live level bar next to the loopback toggle button.
  micTest: 'flex items-center gap-3',
  micTestBar: 'h-2 flex-1 overflow-hidden rounded-full bg-muted',
  micTestFill: 'h-full rounded-full bg-primary transition-[width] duration-75',

  // Profile tab: own container with generous spacing — overrides the tight
  // tabPanel gap so the editor, its hint and the placeholder rows breathe.
  profilePanel: 'flex flex-col gap-6 pt-2',
  profileField: 'flex flex-col gap-2',
  profileLabel: 'font-medium text-sm',
  profileHint: 'text-muted-foreground text-xs',
  profileError: 'text-destructive text-xs',
  profileInputRow: 'flex items-center gap-2',
  profileSpinner: 'mr-1.5 size-4 animate-spin',
  // The "coming soon" placeholders, grouped with a small gap between them.
  profileSoon: 'flex flex-col gap-2',
  profileSoonRow: 'flex items-center justify-between rounded-md border border-dashed px-3 py-2.5',
  profileSoonLabel: 'text-muted-foreground text-sm',
} as const;
