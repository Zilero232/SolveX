export const appSettingsStyles = {
  content: 'flex max-h-[calc(100dvh-2rem)] flex-col gap-4 p-4 sm:max-w-3xl sm:p-6',

  tabs: 'flex min-h-0 flex-1 flex-col gap-3 sm:flex-row sm:gap-4',
  tabsList:
    'flex w-full shrink-0 flex-row items-stretch gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md sm:h-auto sm:w-48 sm:flex-col sm:self-start',
  tabsTrigger: 'flex-none shrink-0 justify-start gap-2 px-3 py-1.5 sm:w-full',
  tabsContent: 'min-w-0 flex-1',

  tabPanel:
    '-mr-2 flex max-h-[calc(100dvh-14rem)] flex-col gap-1 overflow-y-auto pr-2 pt-1 sm:max-h-[24rem]',

  row: 'flex items-center justify-between gap-4 py-2',
  rowText: 'flex min-w-0 flex-col gap-0.5',
  rowLabel: 'text-sm font-medium',
  rowHint: 'text-xs text-muted-foreground',

  stackedRow: 'flex flex-col gap-2 py-2',

  deviceTrigger:
    'flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/8 disabled:opacity-50',
  deviceTriggerLabel: 'truncate text-left',
  deviceMenu: 'max-h-64 w-(--radix-dropdown-menu-trigger-width) overflow-y-auto',

  sliderRow: 'flex items-center gap-3',
  sliderValue: 'w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground',

  micTest: 'flex items-center gap-3',
  micTestBar: 'h-2 flex-1 overflow-hidden rounded-full bg-white/8 shadow-inner shadow-black/30',
  micTestFill:
    'h-full rounded-full bg-brand-cyan shadow-[0_0_8px_oklch(0.82_0.16_200/0.6)] transition-[width] duration-75',

  profilePanel:
    '-mr-2 flex max-h-[calc(100dvh-14rem)] flex-col gap-6 overflow-y-auto pr-2 pt-2 sm:max-h-[24rem]',
  profileForm: 'flex flex-col gap-4',
  profileAvatarRow: 'flex items-center gap-4',
  profileAvatarButton:
    'group/avatar-edit relative size-16 shrink-0 rounded-full outline-hidden focus-visible:ring-2 focus-visible:ring-brand-cyan',
  profileAvatar: 'size-16!',
  profileAvatarOverlay:
    'absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover/avatar-edit:opacity-100',
  profileAvatarOverlayIcon: 'size-5 text-white',
  profileAvatarSpinner:
    'absolute inset-0 flex items-center justify-center rounded-full bg-black/50',
  profileAvatarMeta: 'flex flex-col gap-1',
  profileAvatarRemove:
    'self-start text-destructive text-xs underline-offset-2 hover:underline disabled:opacity-50',
  profileField: 'flex flex-col gap-2',
  bannerRow: 'flex flex-wrap items-center gap-2',
  bannerSwatch:
    'size-7 rounded-full border border-white/15 outline-hidden transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:opacity-50',
  bannerSwatchActive: 'ring-2 ring-white ring-offset-2 ring-offset-background',
  bannerCustomTrigger:
    'flex size-7 items-center justify-center rounded-full border border-white/30 border-dashed outline-hidden transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:opacity-50',
  bannerCustomIcon: 'size-3.5 text-white mix-blend-difference',
  bannerPickerPopover: 'w-auto p-3',
  profileLabel: 'font-medium text-sm',
  profileHint: 'text-muted-foreground text-xs',
  profileError: 'text-destructive text-xs',
  profileSubmit: 'self-start',
  profileSpinner: 'mr-1.5 size-4 animate-spin',
  profileSoon: 'flex flex-col gap-2',
  profileSoonRow:
    'flex items-center justify-between rounded-lg border border-dashed border-white/10 bg-white/3 px-3 py-2.5',
  profileSoonLabel: 'text-muted-foreground text-sm',
} as const;
