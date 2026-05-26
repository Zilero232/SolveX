export const participantCardStyles = {
  root: '@container relative flex aspect-video w-full flex-col overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/5 transition-shadow data-[speaking=true]:ring-2 data-[speaking=true]:ring-indigo-500/70',
  stage: 'relative min-h-0 flex-1',
  videoGrid: 'grid h-full w-full auto-cols-fr grid-flow-col gap-0.5',

  audioStage:
    'flex h-full w-full items-center justify-center bg-gradient-to-b from-neutral-800 to-neutral-900',

  metadata:
    'absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/70 to-transparent px-3 pt-6 pb-2 text-xs text-white',
  micIcon: 'size-3.5 shrink-0 text-red-400',
  name: 'truncate font-medium',

  visualizer: 'flex h-[20cqmin] items-end justify-center gap-[2cqmin]',
  bar: 'w-[4cqmin] min-w-1.5 rounded-full bg-white/20 transition-colors data-[lk-highlighted=true]:bg-indigo-400',
} as const;
