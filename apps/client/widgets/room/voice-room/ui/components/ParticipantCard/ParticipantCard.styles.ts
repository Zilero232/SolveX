export const participantCardStyles = {
  root: '@container relative flex aspect-video w-full flex-col overflow-hidden rounded-2xl bg-black/40 border border-white/10 transition-all data-[speaking=true]:border-brand-cyan/60 data-[speaking=true]:shadow-[0_0_24px_-4px_oklch(0.82_0.16_200/0.6)]',
  stage: 'relative min-h-0 flex-1',
  videoGrid: 'grid h-full w-full auto-cols-fr grid-flow-col gap-0.5',

  audioStage:
    'flex h-full w-full items-center justify-center bg-linear-to-br from-brand-violet/15 via-zinc-900 to-brand-cyan/15',

  visualizer: 'flex h-[20cqmin] items-end justify-center gap-[2cqmin]',
  bar: 'w-[4cqmin] min-w-1.5 rounded-full bg-white/15 transition-colors data-[lk-highlighted=true]:bg-brand-cyan data-[lk-highlighted=true]:shadow-[0_0_8px_oklch(0.82_0.16_200/0.8)]',

  badges: 'absolute top-2 right-2 flex items-center gap-1',
  badge:
    'flex items-center gap-1 rounded-full border border-white/10 bg-black/55 px-2 py-0.5 font-medium text-[10px] text-white backdrop-blur-md',
  badgeIcon: 'size-3',

  metadata:
    'absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-linear-to-t from-black/80 via-black/40 to-transparent px-3 pt-6 pb-2 text-xs text-white',
  micIcon: 'size-3.5 shrink-0 text-destructive drop-shadow-[0_0_6px_oklch(0.7_0.22_22/0.7)]',
  name: 'truncate font-medium',
  nameTrigger:
    'min-w-0 rounded outline-hidden hover:underline focus-visible:ring-2 focus-visible:ring-brand-cyan',
} as const;
